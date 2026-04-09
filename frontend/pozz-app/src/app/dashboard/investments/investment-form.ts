import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InvestmentService } from '../../core/services/investment.service';
import { InvestorService } from '../../core/services/investor.service';
import { AuthService } from '../../core/services/auth.service';
import {
  InvestmentInstrument,
  PaymentStatus,
  InvestmentStatus,
  getInstrumentLabel,
  getPaymentStatusLabel,
  getInvestmentStatusLabel,
} from '../../core/models/investment.models';
import { InvestorListItem } from '../../core/models/investor.models';

@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investment-form.html',
})
export class InvestmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly investmentService = inject(InvestmentService);
  private readonly investorService = inject(InvestorService);
  readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly loadingInvestors = signal(false);
  readonly error = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly investmentId = signal<number | null>(null);
  readonly investors = signal<InvestorListItem[]>([]);

  // Enum arrays for dropdowns
  readonly instruments = Object.values(InvestmentInstrument).filter(v => typeof v === 'number') as number[];
  readonly paymentStatuses = Object.values(PaymentStatus).filter(v => typeof v === 'number') as number[];
  readonly statuses = Object.values(InvestmentStatus).filter(v => typeof v === 'number') as number[];

  readonly investmentForm = this.fb.group({
    // Required fields
    investorId: [null as number | null, Validators.required],
    committedAmount: [null as number | null, [Validators.required, Validators.min(0)]],
    equityPercentage: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]],
    commitmentDate: ['', Validators.required],
    
    // Optional core fields
    projectId: [null as number | null],
    paidAmount: [0],
    instrument: [InvestmentInstrument.Equity],
    paymentStatus: [PaymentStatus.Pending],
    status: [InvestmentStatus.Active],
    
    // SAFE / Convertible Note fields
    valuationCap: [null as number | null],
    discountRate: [null as number | null],
    interestRate: [null as number | null],
    maturityDate: [null as string | null],
    
    // Dates
    closingDate: [null as string | null],
    firstPaymentDate: [null as string | null],
    finalPaymentDate: [null as string | null],
    
    // Legal & Documentation
    termSheetUrl: [''],
    agreementUrl: [''],
    shareCertificateUrl: [''],
    shareCertificateNumber: [null as number | null],
    
    // Additional Terms
    hasBoardSeat: [false],
    hasVetoRights: [false],
    hasInformationRights: [false],
    liquidationPreferenceMultiple: [null as number | null],
    isParticipating: [false],
    hasAntiDilution: [false],
    antiDilutionType: [''],
    
    // CRM / Tracking
    notes: [''],
    internalReference: [''],
  });

  ngOnInit(): void {
    this.loadInvestors();
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.investmentId.set(parseInt(id, 10));
      this.loadInvestment(parseInt(id, 10));
    }
  }

  private loadInvestors(): void {
    this.loadingInvestors.set(true);
    
    this.investorService.getAll(1, 100).subscribe({
      next: (investors) => {
        this.investors.set(investors);
        this.loadingInvestors.set(false);
      },
      error: () => {
        this.loadingInvestors.set(false);
      },
    });
  }

  private loadInvestment(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.investmentService.getById(id).subscribe({
      next: (investment) => {
        this.investmentForm.patchValue({
          investorId: investment.investorId,
          projectId: investment.projectId,
          committedAmount: investment.committedAmount,
          paidAmount: investment.paidAmount,
          equityPercentage: investment.equityPercentage,
          instrument: investment.instrument,
          paymentStatus: investment.paymentStatus,
          status: investment.status,
          valuationCap: investment.valuationCap,
          discountRate: investment.discountRate,
          interestRate: investment.interestRate,
          maturityDate: investment.maturityDate,
          commitmentDate: investment.commitmentDate,
          closingDate: investment.closingDate,
          firstPaymentDate: investment.firstPaymentDate,
          finalPaymentDate: investment.finalPaymentDate,
          termSheetUrl: investment.termSheetUrl,
          agreementUrl: investment.agreementUrl,
          shareCertificateUrl: investment.shareCertificateUrl,
          shareCertificateNumber: investment.shareCertificateNumber,
          hasBoardSeat: investment.hasBoardSeat,
          hasVetoRights: investment.hasVetoRights,
          hasInformationRights: investment.hasInformationRights,
          liquidationPreferenceMultiple: investment.liquidationPreferenceMultiple,
          isParticipating: investment.isParticipating,
          hasAntiDilution: investment.hasAntiDilution,
          antiDilutionType: investment.antiDilutionType,
          notes: investment.notes,
          internalReference: investment.internalReference,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load investment details');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.investmentForm.invalid) {
      this.investmentForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.companyId) {
      this.error.set('User not authenticated or company not set');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.investmentForm.value;

    if (this.isEditMode() && this.investmentId()) {
      // Update existing investment
      const updateRequest = {
        committedAmount: formValue.committedAmount!,
        paidAmount: formValue.paidAmount || undefined,
        equityPercentage: formValue.equityPercentage!,
        instrument: formValue.instrument || undefined,
        paymentStatus: formValue.paymentStatus || undefined,
        status: formValue.status || undefined,
        valuationCap: formValue.valuationCap || undefined,
        discountRate: formValue.discountRate || undefined,
        interestRate: formValue.interestRate || undefined,
        maturityDate: formValue.maturityDate || undefined,
        commitmentDate: formValue.commitmentDate!,
        closingDate: formValue.closingDate || undefined,
        firstPaymentDate: formValue.firstPaymentDate || undefined,
        finalPaymentDate: formValue.finalPaymentDate || undefined,
        termSheetUrl: formValue.termSheetUrl || undefined,
        agreementUrl: formValue.agreementUrl || undefined,
        shareCertificateUrl: formValue.shareCertificateUrl || undefined,
        shareCertificateNumber: formValue.shareCertificateNumber || undefined,
        hasBoardSeat: formValue.hasBoardSeat || undefined,
        hasVetoRights: formValue.hasVetoRights || undefined,
        hasInformationRights: formValue.hasInformationRights || undefined,
        liquidationPreferenceMultiple: formValue.liquidationPreferenceMultiple || undefined,
        isParticipating: formValue.isParticipating || undefined,
        hasAntiDilution: formValue.hasAntiDilution || undefined,
        antiDilutionType: formValue.antiDilutionType || undefined,
        notes: formValue.notes || undefined,
        internalReference: formValue.internalReference || undefined,
      };

      this.investmentService.update(this.investmentId()!, updateRequest).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/investments']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Failed to update investment');
          this.loading.set(false);
        },
      });
    } else {
      // Create new investment
      const createRequest = {
        investorId: formValue.investorId!,
        projectId: formValue.projectId || undefined,
        companyId: currentUser.companyId,
        committedAmount: formValue.committedAmount!,
        paidAmount: formValue.paidAmount || undefined,
        equityPercentage: formValue.equityPercentage!,
        instrument: formValue.instrument || undefined,
        paymentStatus: formValue.paymentStatus || undefined,
        status: formValue.status || undefined,
        valuationCap: formValue.valuationCap || undefined,
        discountRate: formValue.discountRate || undefined,
        interestRate: formValue.interestRate || undefined,
        maturityDate: formValue.maturityDate || undefined,
        commitmentDate: formValue.commitmentDate!,
        closingDate: formValue.closingDate || undefined,
        firstPaymentDate: formValue.firstPaymentDate || undefined,
        finalPaymentDate: formValue.finalPaymentDate || undefined,
        termSheetUrl: formValue.termSheetUrl || undefined,
        agreementUrl: formValue.agreementUrl || undefined,
        shareCertificateUrl: formValue.shareCertificateUrl || undefined,
        shareCertificateNumber: formValue.shareCertificateNumber || undefined,
        hasBoardSeat: formValue.hasBoardSeat || undefined,
        hasVetoRights: formValue.hasVetoRights || undefined,
        hasInformationRights: formValue.hasInformationRights || undefined,
        liquidationPreferenceMultiple: formValue.liquidationPreferenceMultiple || undefined,
        isParticipating: formValue.isParticipating || undefined,
        hasAntiDilution: formValue.hasAntiDilution || undefined,
        antiDilutionType: formValue.antiDilutionType || undefined,
        notes: formValue.notes || undefined,
        internalReference: formValue.internalReference || undefined,
      };

      this.investmentService.create(createRequest).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/investments']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Failed to create investment');
          this.loading.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/investments']);
  }

  getInstrumentLabel = getInstrumentLabel;
  getPaymentStatusLabel = getPaymentStatusLabel;
  getInvestmentStatusLabel = getInvestmentStatusLabel;
}
