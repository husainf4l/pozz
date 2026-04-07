import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Project, CreateProjectRequest, ProjectStatus } from '../../core/models/project.models';
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
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);

  readonly projects = this.projectService.myProjects;
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingProject = signal<Project | null>(null);

  readonly ProjectStatus = ProjectStatus;

  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    summary: ['', Validators.maxLength(500)],
    description: ['', Validators.maxLength(5000)],
    industry: [''],
    location: [''],
    fundingGoal: [0, [Validators.required, Validators.min(1)]],
    minimumInvestment: [0, [Validators.required, Validators.min(1)]],
    fundingDeadline: [''],
    expectedReturn: [null as number | null],
    durationMonths: [null as number | null],
    imageUrl: [''],
  });

  readonly industries = [
    'Technology', 'FinTech', 'HealthTech', 'Real Estate',
    'E-Commerce', 'SaaS', 'Sustainability', 'Education',
    'Manufacturing', 'Retail', 'Other',
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
    this.showForm.set(true);
    this.error.set(null);
  }

  openEditForm(project: Project): void {
    this.editingProject.set(project);
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
    if (this.projectForm.invalid) return;

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
    };

    const editing = this.editingProject();
    const operation = editing
      ? this.projectService.updateProject(editing.id, request)
      : this.projectService.createProject(request);

    operation.subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeForm();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to save project');
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
}

