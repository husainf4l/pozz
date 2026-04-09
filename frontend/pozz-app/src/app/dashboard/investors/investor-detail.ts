import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { InvestorService } from '../../core/services/investor.service';
import { InvestmentService } from '../../core/services/investment.service';
import { Investor, getPipelineStageLabel, getInvestorTypeLabel, getPriorityLabel, getPriorityColor } from '../../core/models/investor.models';
import { InvestmentListItem } from '../../core/models/investment.models';

type TabType = 'overview' | 'investments' | 'communications' | 'documents';

@Component({
  selector: 'app-investor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investor-detail.html',
})
export class InvestorDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly investorService = inject(InvestorService);
  private readonly investmentService = inject(InvestmentService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly investor = signal<Investor | null>(null);
  readonly investments = signal<InvestmentListItem[]>([]);
  readonly activeTab = signal<TabType>('overview');
  readonly loadingInvestments = signal(false);

  readonly totalInvested = computed(() => {
    return this.investments().reduce((sum, inv) => sum + inv.committedAmount, 0);
  });

  readonly totalPaid = computed(() => {
    return this.investments().reduce((sum, inv) => sum + inv.paidAmount, 0);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    this.loadInvestor(parseInt(id, 10));
  }

  private loadInvestor(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.investorService.getById(id).subscribe({
      next: (investor) => {
        this.investor.set(investor);
        this.loading.set(false);
        this.loadInvestments(id);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to load investor details');
        this.loading.set(false);
      },
    });
  }

  private loadInvestments(investorId: number): void {
    this.loadingInvestments.set(true);
    this.investmentService.getByInvestorId(investorId, 1, 100).subscribe({
      next: (result) => {
        this.investments.set(result.items);
        this.loadingInvestments.set(false);
      },
      error: () => {
        this.loadingInvestments.set(false);
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
    if (this.investor()?.id) {
      this.router.navigate(['/dashboard/investors', this.investor()!.id, 'edit']);
    }
  }

  onDelete(): void {
    const investor = this.investor();
    if (!investor) return;

    if (confirm(`Are you sure you want to delete ${investor.userFullName}?`)) {
      this.investorService.delete(investor.id).subscribe({
        next: () => {
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to delete investor');
        },
      });
    }
  }

  getPipelineStageLabel = getPipelineStageLabel;
  getInvestorTypeLabel = getInvestorTypeLabel;
  getPriorityLabel = getPriorityLabel;
  getPriorityColor = getPriorityColor;

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
