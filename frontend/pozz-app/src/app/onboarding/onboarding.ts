import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { OnboardingService } from '../core/services/onboarding.service';
import { TranslateService } from '../core/services/translate.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { LangSwitcherComponent } from '../shared/lang-switcher/lang-switcher';
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle';
import { OnboardingStatus } from '../core/models/onboarding.models';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, LangSwitcherComponent, ThemeToggleComponent],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class OnboardingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly onboardingService = inject(OnboardingService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly translate = inject(TranslateService);

  status = signal<OnboardingStatus | null>(null);
  loadingStatus = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  // ── Step 1: Personal Info ────────────────────────────────────────────────
  personalInfoForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: [''],
    dateOfBirth: [''],
    nationality: [''],
    country: [''],
  });

  // ── Step 2a: Investor Profile ────────────────────────────────────────────
  investorProfileForm = this.fb.group({
    investorType: ['Individual', Validators.required],
    investmentBudgetRange: [''],
    linkedInProfile: [''],
  });
  investmentInterests = signal<string[]>([]);

  // ── Step 2b: Company Setup (ProjectOwner) ────────────────────────────────
  companySetupForm = this.fb.group({
    name: ['', Validators.required],
    industry: [''],
    registrationNumber: [''],
    description: [''],
  });

  // ── Step 3b: Company Details (ProjectOwner) ──────────────────────────────
  companyDetailsForm = this.fb.group({
    website: [''],
    email: [''],
    phone: [''],
  });

  readonly availableInterests = [
    'Technology', 'FinTech', 'HealthTech', 'Real Estate',
    'E-Commerce', 'SaaS', 'Sustainability', 'Education',
  ];

  readonly budgetRanges = [
    'Under $50k', '$50k – $100k', '$100k – $500k', '$500k – $1M', 'Over $1M',
  ];

  readonly industries = [
    'Technology', 'Finance', 'Healthcare', 'Real Estate',
    'Retail', 'Education', 'Manufacturing', 'Other',
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.personalInfoForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
    this.loadStatus();
  }

  private loadStatus(): void {
    this.loadingStatus.set(true);
    this.onboardingService.getStatus().subscribe({
      next: (s) => {
        this.status.set(s);
        this.loadingStatus.set(false);
        if (s.isComplete) {
          this.router.navigate([`/${this.translate.currentLocale()}/dashboard`]);
        }
      },
      error: () => {
        this.error.set('Could not load onboarding status. Please refresh.');
        this.loadingStatus.set(false);
      },
    });
  }

  get currentStep(): string | null {
    return this.status()?.currentStep ?? null;
  }

  get role(): string {
    return this.status()?.role ?? '';
  }

  // ── Interest toggle helpers ──────────────────────────────────────────────
  toggleInterest(interest: string): void {
    const current = this.investmentInterests();
    if (current.includes(interest)) {
      this.investmentInterests.set(current.filter((i) => i !== interest));
    } else {
      this.investmentInterests.set([...current, interest]);
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.investmentInterests().includes(interest);
  }

  // ── Step submit methods ──────────────────────────────────────────────────
  submitPersonalInfo(): void {
    if (this.personalInfoForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
      return;
    }
    const v = this.personalInfoForm.getRawValue();
    this.submit(
      this.onboardingService.completePersonalInfo({
        firstName: v.firstName!,
        lastName: v.lastName!,
        phoneNumber: v.phoneNumber || undefined,
        dateOfBirth: v.dateOfBirth || undefined,
        nationality: v.nationality || undefined,
        country: v.country || undefined,
      }),
    );
  }

  submitInvestorProfile(): void {
    if (this.investorProfileForm.invalid) {
      this.investorProfileForm.markAllAsTouched();
      return;
    }
    const v = this.investorProfileForm.getRawValue();
    this.submit(
      this.onboardingService.completeInvestorProfile({
        investorType: v.investorType!,
        investmentBudgetRange: v.investmentBudgetRange || undefined,
        investmentInterests: this.investmentInterests(),
        linkedInProfile: v.linkedInProfile || undefined,
      }),
    );
  }

  submitCompanySetup(): void {
    if (this.companySetupForm.invalid) {
      this.companySetupForm.markAllAsTouched();
      return;
    }
    const v = this.companySetupForm.getRawValue();
    this.submit(
      this.onboardingService.completeCompanySetup({
        name: v.name!,
        industry: v.industry || undefined,
        registrationNumber: v.registrationNumber || undefined,
        description: v.description || undefined,
      }),
    );
  }

  submitCompanyDetails(): void {
    const v = this.companyDetailsForm.getRawValue();
    this.submit(
      this.onboardingService.completeCompanyDetails({
        website: v.website || undefined,
        email: v.email || undefined,
        phone: v.phone || undefined,
      }),
    );
  }

  acceptTerms(): void {
    this.submit(this.onboardingService.acceptTerms());
  }

  private submit(obs: Observable<OnboardingStatus>): void {
    this.submitting.set(true);
    this.error.set(null);
    obs.subscribe({
      next: (s) => {
        this.status.set(s);
        this.submitting.set(false);
        if (s.isComplete) {
          this.authService.updateOnboarding({
            isComplete: true,
            role: s.role,
            status: s.status,
            currentStep: null,
            currentStepLabel: null,
          });
          this.router.navigate([`/${this.translate.currentLocale()}/dashboard`]);
        }
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Something went wrong. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
