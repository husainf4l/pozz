import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { InvestmentService } from '../../core/services/investment.service';
import { Investment, getInstrumentLabel, getPaymentStatusLabel, getPaymentStatusBadgeColor, getInvestmentStatusLabel, getInvestmentStatusBadgeColor } from '../../core/models/investment.models';

type TabType = 'overview' | 'payments' | 'documents' | 'activity';

@Component({
  selector: 'app-investment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './investment-detail.html',
})
export class InvestmentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly investmentService = inject(InvestmentService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly investment = signal<Investment | null>(null);
  readonly activeTab = signal<TabType>('overview');

  readonly outstanding = computed(() => {
    const inv = this.investment();
    if (!inv) return 0;
    return inv.committedAmount - inv.paidAmount;
  });

  readonly paymentProgress = computed(() => {
    const inv = this.investment();
    if (!inv || inv.committedAmount === 0) return 0;
    return (inv.paidAmount / inv.committedAmount) * 100;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    this.loadInvestment(parseInt(id, 10));
  }

  private loadInvestment(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.investmentService.getById(id).subscribe({
      next: (investment) => {
        this.investment.set(investment);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load investment details');
        this.loading.set(false);
      },
    });
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  onBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onEdit(): void {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit investment:', this.investment()?.id);
  }

  onDelete(): void {
    const investment = this.investment();
    if (!investment) return;

    if (confirm(`Are you sure you want to delete this investment?`)) {
      this.investmentService.delete(investment.id).subscribe({
        next: () => {
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to delete investment');
        },
      });
    }
  }

  onViewInvestor(): void {
    const investorId = this.investment()?.investorId;
    if (investorId) {
      this.router.navigate(['/en/dashboard/investors', investorId]);
    }
  }

  getInstrumentLabel = getInstrumentLabel;
  getPaymentStatusLabel = getPaymentStatusLabel;
  getPaymentStatusBadgeColor = getPaymentStatusBadgeColor;
  getInvestmentStatusLabel = getInvestmentStatusLabel;
  getInvestmentStatusBadgeColor = getInvestmentStatusBadgeColor;

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatPercent(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  }
}
