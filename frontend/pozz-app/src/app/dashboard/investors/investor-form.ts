import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InvestorService } from '../../core/services/investor.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  InvestorType, 
  PipelineStage, 
  getInvestorTypeLabel, 
  getPipelineStageLabel 
} from '../../core/models/investor.models';

@Component({
  selector: 'app-investor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investor-form.html',
})
export class InvestorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly investorService = inject(InvestorService);
  readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly investorId = signal<number | null>(null);

  // Enum arrays for dropdowns
  readonly investorTypes = Object.values(InvestorType).filter(v => typeof v === 'number') as number[];
  readonly pipelineStages = Object.values(PipelineStage).filter(v => typeof v === 'number') as number[];
  readonly priorities = [1, 2, 3, 4, 5];

  readonly investorForm = this.fb.group({
    // Required fields for creation
    investorType: [InvestorType.Individual, Validators.required],
    
    // Contact Information
    primaryEmail: ['', [Validators.email]],
    primaryPhone: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    country: [''],
    postalCode: [''],
    
    // Professional Details
    position: [''],
    linkedInUrl: [''],
    website: [''],
    yearsOfExperience: [null as number | null],
    bio: [''],
    
    // Investment Profile
    investmentRange: [''],
    portfolioCompanies: [''],
    totalInvestments: [null as number | null],
    
    // Pipeline Tracking
    pipelineStage: [PipelineStage.Target],
    lastContactDate: [null as string | null],
    nextFollowUpDate: [null as string | null],
    priority: [3],
    potentialInvestmentAmount: [null as number | null],
    
    // CRM Data
    notes: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.investorId.set(parseInt(id, 10));
      this.loadInvestor(parseInt(id, 10));
    }
  }

  private loadInvestor(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.investorService.getById(id).subscribe({
      next: (investor) => {
        this.investorForm.patchValue({
          investorType: investor.investorType,
          primaryEmail: investor.primaryEmail,
          primaryPhone: investor.primaryPhone,
          addressLine1: investor.addressLine1,
          addressLine2: investor.addressLine2,
          city: investor.city,
          country: investor.country,
          postalCode: investor.postalCode,
          position: investor.position,
          linkedInUrl: investor.linkedInUrl,
          website: investor.website,
          yearsOfExperience: investor.yearsOfExperience,
          bio: investor.bio,
          investmentRange: investor.investmentRange,
          portfolioCompanies: investor.portfolioCompanies,
          totalInvestments: investor.totalInvestments,
          pipelineStage: investor.pipelineStage,
          lastContactDate: investor.lastContactDate,
          nextFollowUpDate: investor.nextFollowUpDate,
          priority: investor.priority,
          potentialInvestmentAmount: investor.potentialInvestmentAmount,
          notes: investor.notes,
          isActive: investor.isActive,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load investor details');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.investorForm.invalid) {
      this.investorForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.error.set('User not authenticated');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.investorForm.value;

    if (this.isEditMode() && this.investorId()) {
      // Update existing investor
      const updateRequest = {
        investorType: formValue.investorType!,
        primaryEmail: formValue.primaryEmail || undefined,
        primaryPhone: formValue.primaryPhone || undefined,
        addressLine1: formValue.addressLine1 || undefined,
        addressLine2: formValue.addressLine2 || undefined,
        city: formValue.city || undefined,
        country: formValue.country || undefined,
        postalCode: formValue.postalCode || undefined,
        position: formValue.position || undefined,
        linkedInUrl: formValue.linkedInUrl || undefined,
        website: formValue.website || undefined,
        yearsOfExperience: formValue.yearsOfExperience || undefined,
        bio: formValue.bio || undefined,
        investmentRange: formValue.investmentRange || undefined,
        portfolioCompanies: formValue.portfolioCompanies || undefined,
        totalInvestments: formValue.totalInvestments || undefined,
        pipelineStage: formValue.pipelineStage || undefined,
        lastContactDate: formValue.lastContactDate || undefined,
        nextFollowUpDate: formValue.nextFollowUpDate || undefined,
        priority: formValue.priority || undefined,
        potentialInvestmentAmount: formValue.potentialInvestmentAmount || undefined,
        notes: formValue.notes || undefined,
        isActive: formValue.isActive ?? true,
      };

      this.investorService.update(this.investorId()!, updateRequest).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/investors']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Failed to update investor');
          this.loading.set(false);
        },
      });
    } else {
      // Create new investor
      const createRequest = {
        userId: currentUser.id,
        companyId: currentUser.companyId,
        investorType: formValue.investorType!,
        primaryEmail: formValue.primaryEmail || undefined,
        primaryPhone: formValue.primaryPhone || undefined,
        addressLine1: formValue.addressLine1 || undefined,
        addressLine2: formValue.addressLine2 || undefined,
        city: formValue.city || undefined,
        country: formValue.country || undefined,
        postalCode: formValue.postalCode || undefined,
        position: formValue.position || undefined,
        linkedInUrl: formValue.linkedInUrl || undefined,
        website: formValue.website || undefined,
        yearsOfExperience: formValue.yearsOfExperience || undefined,
        bio: formValue.bio || undefined,
        investmentRange: formValue.investmentRange || undefined,
        portfolioCompanies: formValue.portfolioCompanies || undefined,
        totalInvestments: formValue.totalInvestments || undefined,
        pipelineStage: formValue.pipelineStage || undefined,
        lastContactDate: formValue.lastContactDate || undefined,
        nextFollowUpDate: formValue.nextFollowUpDate || undefined,
        priority: formValue.priority || undefined,
        potentialInvestmentAmount: formValue.potentialInvestmentAmount || undefined,
        notes: formValue.notes || undefined,
        isActive: formValue.isActive ?? true,
      };

      this.investorService.create(createRequest).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/investors']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Failed to create investor');
          this.loading.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/investors']);
  }

  getInvestorTypeLabel = getInvestorTypeLabel;
  getPipelineStageLabel = getPipelineStageLabel;
  
  getPriorityLabel(priority: number): string {
    const labels: { [key: number]: string } = {
      5: 'Critical',
      4: 'High',
      3: 'Medium',
      2: 'Low',
      1: 'Very Low',
    };
    return labels[priority] || 'Unknown';
  }
}
