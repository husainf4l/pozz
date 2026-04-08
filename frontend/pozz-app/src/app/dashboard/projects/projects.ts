import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { UploadService } from '../../core/services/upload.service';
import { 
  Project, 
  CreateProjectRequest, 
  ProjectStatus, 
  ProjectStage, 
  ProjectGoal, 
  BusinessModel 
} from '../../core/models/project.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class ProjectsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly uploadService = inject(UploadService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly projects = this.projectService.myProjects;
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingProject = signal<Project | null>(null);
  readonly uploadingImage = signal(false);
  readonly imagePreview = signal<string | SafeUrl | null>(null);

  readonly ProjectStatus = ProjectStatus;
  readonly ProjectStage = ProjectStage;
  readonly ProjectGoal = ProjectGoal;
  readonly BusinessModel = BusinessModel;

  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    summary: ['', Validators.maxLength(500)],
    description: ['', Validators.maxLength(5000)],
    industry: [''],
    location: [''],
    fundingGoal: [0, [Validators.required, Validators.min(1), Validators.max(9999999999999999)]],
    minimumInvestment: [0, [Validators.required, Validators.min(1), Validators.max(9999999999999999)]],
    fundingDeadline: [''],
    expectedReturn: [null as number | null, [Validators.min(0), Validators.max(99999999)]],
    durationMonths: [null as number | null, [Validators.min(1), Validators.max(999)]],
    imageUrl: [''],
    // Enhanced fields
    stage: [null as ProjectStage | null, Validators.required],
    primaryGoal: [null as ProjectGoal | null, Validators.required],
    websiteUrl: ['', [Validators.required, Validators.maxLength(500)]],
    pitchDeckUrl: ['', [Validators.required, Validators.maxLength(500)]],
    internalNotes: ['', Validators.maxLength(2000)],
    tags: ['', Validators.maxLength(500)],
    targetMarket: ['', Validators.maxLength(200)],
    businessModel: [null as BusinessModel | null],
    currentStatusSummary: ['', Validators.maxLength(300)],
  });

  readonly industries = [
    'Technology', 'FinTech', 'HealthTech', 'Real Estate',
    'E-Commerce', 'SaaS', 'Sustainability', 'Education',
    'Manufacturing', 'Retail', 'Other',
  ];

  readonly stages = [
    { value: ProjectStage.Idea, label: 'Idea' },
    { value: ProjectStage.MVP, label: 'MVP' },
    { value: ProjectStage.EarlyRevenue, label: 'Early Revenue' },
    { value: ProjectStage.Scaling, label: 'Scaling' },
  ];

  readonly goals = [
    { value: ProjectGoal.RaiseFunding, label: 'Raise Funding' },
    { value: ProjectGoal.SellProject, label: 'Sell Project' },
    { value: ProjectGoal.FindPartners, label: 'Find Partners' },
    { value: ProjectGoal.StrategicInvestment, label: 'Strategic Investment' },
  ];

  readonly businessModels = [
    { value: BusinessModel.SaaS, label: 'SaaS' },
    { value: BusinessModel.Marketplace, label: 'Marketplace' },
    { value: BusinessModel.ECommerce, label: 'E-Commerce' },
    { value: BusinessModel.Subscription, label: 'Subscription' },
    { value: BusinessModel.Other, label: 'Other' },
  ];

  readonly targetMarkets = [
    'USA', 'Canada', 'Europe', 'GCC', 'MENA', 
    'Asia', 'Africa', 'Latin America', 'Global',
  ];

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.projectService.getMyProjects().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load projects');
        this.loading.set(false);
      },
    });
  }

  openCreateForm(): void {
    this.editingProject.set(null);
    this.projectForm.reset({
      fundingGoal: 0,
      minimumInvestment: 0,
    });
    this.imagePreview.set(null);
    this.showForm.set(true);
    this.error.set(null);
  }

  openEditForm(project: Project): void {
    this.editingProject.set(project);
    if (project.imageUrl && project.imageUrl.startsWith('data:image')) {
      this.imagePreview.set(this.sanitizer.bypassSecurityTrustUrl(project.imageUrl));
    } else {
      this.imagePreview.set(project.imageUrl || null);
    }
    this.projectForm.patchValue({
      title: project.title,
      summary: project.summary || '',
      description: project.description || '',
      industry: project.industry || '',
      location: project.location || '',
      fundingGoal: project.fundingGoal,
      minimumInvestment: project.minimumInvestment,
      fundingDeadline: project.fundingDeadline ? project.fundingDeadline.split('T')[0] : '',
      expectedReturn: project.expectedReturn,
      durationMonths: project.durationMonths,
      imageUrl: project.imageUrl || '',
      // Enhanced fields
      stage: project.stage,
      primaryGoal: project.primaryGoal,
      websiteUrl: project.websiteUrl || '',
      pitchDeckUrl: project.pitchDeckUrl || '',
      internalNotes: project.internalNotes || '',
      tags: project.tags || '',
      targetMarket: project.targetMarket || '',
      businessModel: project.businessModel,
      currentStatusSummary: project.currentStatusSummary || '',
    });
    this.showForm.set(true);
    this.error.set(null);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingProject.set(null);
    this.projectForm.reset();
    this.error.set(null);
  }

  submitProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      const invalidControls = [];
      const controls = this.projectForm.controls;
      for (const name in controls) {
        if (controls[name as keyof typeof controls].invalid) invalidControls.push(name);
      }
      this.error.set(`Please fill all required fields correctly. Invalid fields: ${invalidControls.join(', ')}`);
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const formValue = this.projectForm.value;
    const request: CreateProjectRequest = {
      title: formValue.title!,
      summary: formValue.summary || undefined,
      description: formValue.description || undefined,
      industry: formValue.industry || undefined,
      location: formValue.location || undefined,
      fundingGoal: formValue.fundingGoal!,
      minimumInvestment: formValue.minimumInvestment!,
      fundingDeadline: formValue.fundingDeadline || undefined,
      expectedReturn: formValue.expectedReturn || undefined,
      durationMonths: formValue.durationMonths || undefined,
      imageUrl: formValue.imageUrl || undefined,
      // Enhanced fields
      stage: formValue.stage !== null && formValue.stage !== undefined ? formValue.stage : undefined,
      primaryGoal: formValue.primaryGoal !== null && formValue.primaryGoal !== undefined ? formValue.primaryGoal : undefined,
      websiteUrl: formValue.websiteUrl || undefined,
      pitchDeckUrl: formValue.pitchDeckUrl || undefined,
      internalNotes: formValue.internalNotes || undefined,
      tags: formValue.tags || undefined,
      targetMarket: formValue.targetMarket || undefined,
      businessModel: formValue.businessModel !== null && formValue.businessModel !== undefined ? formValue.businessModel : undefined,
      currentStatusSummary: formValue.currentStatusSummary || undefined,
    };

    console.log('=== SUBMITTING PROJECT ===');
    console.log('Editing:', this.editingProject());
    console.log('Request object:', {
      ...request,
      imageUrl: request.imageUrl ? `${request.imageUrl.substring(0, 50)}... (${request.imageUrl.length} chars)` : 'null'
    });
    console.log('Image URL length:', request.imageUrl?.length || 0);

    const editing = this.editingProject();
    const operation = editing
      ? this.projectService.updateProject(editing.id, request)
      : this.projectService.createProject(request);

    operation.subscribe({
      next: () => {
        console.log('Project submitted successfully!');
        this.submitting.set(false);
        this.closeForm();
      },
      error: (err) => {
        console.error('Project creation error:', err);
        console.error('Error status:', err.status);
        console.error('Error response:', err.error);
        
        let errorMessage = err.error?.message || err.error?.error || 'Failed to save project';
        if (err.status === 401 || err.status === 403) {
          errorMessage = 'You do not have permission to create projects. Please contact an administrator.';
        } else if (err.error?.errors) {
          const validationErrors = Object.values(err.error.errors).flat().join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (err.error?.title) {
          errorMessage = err.error.title;
        }
        this.error.set(errorMessage);
        this.submitting.set(false);
      },
    });
  }

  deleteProject(project: Project): void {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    this.projectService.deleteProject(project.id).subscribe({
      error: (err) => {
        alert(err.error?.message || 'Failed to delete project');
      },
    });
  }

  getStatusLabel(status: ProjectStatus): string {
    const labels: Record<ProjectStatus, string> = {
      [ProjectStatus.Draft]: 'Draft',
      [ProjectStatus.Active]: 'Active',
      [ProjectStatus.Funded]: 'Funded',
      [ProjectStatus.Closed]: 'Closed',
      [ProjectStatus.Cancelled]: 'Cancelled',
    };
    return labels[status];
  }

  getStatusColor(status: ProjectStatus): string {
    const colors: Record<ProjectStatus, string> = {
      [ProjectStatus.Draft]: 'bg-gray-100 text-gray-700',
      [ProjectStatus.Active]: 'bg-green-100 text-green-700',
      [ProjectStatus.Funded]: 'bg-blue-100 text-blue-700',
      [ProjectStatus.Closed]: 'bg-red-100 text-red-700',
      [ProjectStatus.Cancelled]: 'bg-orange-100 text-orange-700',
    };
    return colors[status];
  }

  getFundingProgress(project: Project): number {
    return Math.min(100, (project.currentFunding / project.fundingGoal) * 100);
  }

  triggerFileInput(): void {
    console.log('=== TEST BUTTON CLICKED ===');
    console.log('fileInput ref:', this.fileInput);
    if (this.fileInput) {
      console.log('Clicking file input programmatically...');
      const inputElement = this.fileInput.nativeElement;
      console.log('Input element:', inputElement);
      console.log('Input element value before click:', inputElement.value);
      
      // Clear any existing value
      inputElement.value = '';
      
      // Add a one-time change listener that will process the file
      const changeHandler = async (e: Event) => {
        console.log('=== DIRECT CHANGE EVENT FIRED ===');
        console.log('Event from direct listener:', e);
        console.log('Files from direct listener:', inputElement.files);
        
        if (inputElement.files && inputElement.files.length > 0) {
          const file = inputElement.files[0];
          console.log('File selected via direct handler:', file);
          await this.processImageFile(file);
        }
        
        // Remove the listener after use
        inputElement.removeEventListener('change', changeHandler);
      };
      
      inputElement.addEventListener('change', changeHandler);
      inputElement.click();
    } else {
      console.error('fileInput ViewChild is not available!');
    }
  }

  async processImageFile(file: File): Promise<void> {
    console.log('=== processImageFile CALLED ===');
    console.log('File:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select a valid image file');
      console.log('Invalid file type:', file.type);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.error.set('Image size must be less than 10MB');
      console.log('File too large:', file.size);
      return;
    }

    console.log('File validated, uploading to S3...');

    this.uploadingImage.set(true);
    this.error.set(null);

    try {
      // Upload to S3 via backend
      const response = await firstValueFrom(this.uploadService.uploadImage(file));
      console.log('S3 upload success:', response);
      
      // Store the S3 URL in the form
      this.projectForm.patchValue({ imageUrl: response.url });
      
      // Update preview with the CDN URL (no need to sanitize external URLs)
      this.imagePreview.set(response.url);
      
      console.log('Image uploaded and preview updated');
      this.uploadingImage.set(false);
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      this.error.set(error?.error?.error || 'Failed to upload image');
      this.uploadingImage.set(false);
    }
  }

  onLabelClick(): void {
    console.log('=== LABEL CLICKED ===');
  }

  async onImageSelect(event: Event): Promise<void> {
    console.log('=== onImageSelect CALLED ===');
    console.log('Event type:', event.type);
    
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    console.log('File extracted:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select a valid image file');
      console.log('Invalid file type:', file.type);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.error.set('Image size must be less than 10MB');
      console.log('File too large:', file.size);
      return;
    }

    console.log('File validated, uploading to S3...', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    this.uploadingImage.set(true);
    this.error.set(null);

    try {
      // Upload to S3 via backend
      const response = await firstValueFrom(this.uploadService.uploadImage(file));
      console.log('S3 upload success:', response);
      
      // Store the S3 URL in the form
      this.projectForm.patchValue({ imageUrl: response.url });
      
      // Update preview with the CDN URL
      this.imagePreview.set(response.url);
      
      console.log('Image uploaded successfully, URL:', response.url);
    } catch (error: any) {
      this.error.set(error?.error?.error || 'Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      this.uploadingImage.set(false);
    }
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.projectForm.patchValue({ imageUrl: '' });
  }

  getSafeImageUrl(imageUrl: string): SafeUrl | string {
    // Support legacy base64 images (for old data)
    if (imageUrl && imageUrl.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    // CDN URLs can be used directly
    return imageUrl;
  }
}

