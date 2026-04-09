import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CapTableService, CapTable, Shareholder, ShareholderType, CreateShareholderDto, CreateRoundDto } from '../../core/services/captable.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-captable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './captable.html',
})
export class CaptableComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly capTableService = inject(CapTableService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly capTable = signal<CapTable | null>(null);
  readonly showAddShareholderModal = signal(false);
  readonly showAddRoundModal = signal(false);

  readonly shareholderTypes: ShareholderType[] = ['founder', 'investor', 'employee', 'advisor'];

  readonly shareholderForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    type: ['investor' as ShareholderType, Validators.required],
    shares: [0, [Validators.required, Validators.min(1)]],
    investmentAmount: [0, Validators.min(0)],
  });

  readonly roundForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    valuation: [0, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
  });

  readonly stats = computed(() => {
    const ct = this.capTable();
    if (!ct) return null;
    
    return {
      postMoneyValuation: ct.postMoneyValuation,
      totalShareholders: ct.shareholders.length,
      totalShares: ct.totalShares,
      fundingRounds: ct.rounds.length,
    };
  });

  ngOnInit(): void {
    this.loadCapTable();
  }

  loadCapTable(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.capTableService.get(companyId).subscribe({
      next: (capTable) => {
        this.capTable.set(capTable);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addShareholder(): void {
    if (this.shareholderForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateShareholderDto = {
      name: this.shareholderForm.value.name!,
      type: this.shareholderForm.value.type!,
      shares: this.shareholderForm.value.shares!,
      investmentAmount: this.shareholderForm.value.investmentAmount || undefined,
    };

    this.capTableService.addShareholder(companyId, dto).subscribe({
      next: () => {
        this.loadCapTable();
        this.shareholderForm.reset({ type: 'investor' });
        this.showAddShareholderModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  addRound(): void {
    if (this.roundForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateRoundDto = {
      name: this.roundForm.value.name!,
      amount: this.roundForm.value.amount!,
      valuation: this.roundForm.value.valuation!,
      date: this.roundForm.value.date!,
    };

    this.capTableService.addRound(companyId, dto).subscribe({
      next: () => {
        this.loadCapTable();
        this.roundForm.reset();
        this.showAddRoundModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  getTypeColor(type: ShareholderType): string {
    switch (type) {
      case 'founder': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'investor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'employee': return 'bg-green-100 text-green-700 border-green-200';
      case 'advisor': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
