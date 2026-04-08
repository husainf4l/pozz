import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { InvestmentService } from '../../core/services/investment.service';
import {
  InvestmentListItem,
  InvestmentSearchRequest,
  PaymentStatus,
  InvestmentStatus,
  InvestmentInstrument,
  getInstrumentLabel,
  getPaymentStatusLabel,
  getPaymentStatusBadgeColor,
  getInvestmentStatusLabel,
  getInvestmentStatusBadgeColor,
} from '../../core/models/investment.models';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './investments.html',
})
export class InvestmentsComponent implements OnInit {
  private readonly investmentService = inject(InvestmentService);
  private readonly router = inject(Router);

  // ── State ─────────────────────────────────────────────────────────────────
  readonly investments = signal<InvestmentListItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // ── Pagination & Search ───────────────────────────────────────────────────
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);
  readonly totalCount = signal(0);
  readonly searchTerm = signal('');
  readonly selectedPaymentStatus = signal<PaymentStatus | undefined>(undefined);
  readonly selectedStatus = signal<InvestmentStatus | undefined>(undefined);
  readonly selectedInstrument = signal<InvestmentInstrument | undefined>(undefined);
  readonly sortBy = signal('commitmentDate');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  // ── Computed Values ───────────────────────────────────────────────────────
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly totalCommitted = computed(() => 
    this.investments().reduce((sum, inv) => sum + inv.committedAmount, 0)
  );
  readonly totalPaid = computed(() => 
    this.investments().reduce((sum, inv) => sum + inv.paidAmount, 0)
  );

  // ── Enums for Template ────────────────────────────────────────────────────
  readonly PaymentStatus = PaymentStatus;
  readonly InvestmentStatus = InvestmentStatus;
  readonly InvestmentInstrument = InvestmentInstrument;

  // ── Helper Functions ──────────────────────────────────────────────────────
  readonly getInstrumentLabel = getInstrumentLabel;
  readonly getPaymentStatusLabel = getPaymentStatusLabel;
  readonly getPaymentStatusBadgeColor = getPaymentStatusBadgeColor;
  readonly getInvestmentStatusLabel = getInvestmentStatusLabel;
  readonly getInvestmentStatusBadgeColor = getInvestmentStatusBadgeColor;

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.loading.set(true);
    this.error.set(null);

    const request: InvestmentSearchRequest = {
      searchTerm: this.searchTerm() || undefined,
      paymentStatus: this.selectedPaymentStatus(),
      status: this.selectedStatus(),
      instrument: this.selectedInstrument(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    this.investmentService.search(request).subscribe({
      next: (result) => {
        this.investments.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load investments. Please try again.');
        this.loading.set(false);
        console.error('Error loading investments:', err);
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadInvestments();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadInvestments();
  }

  onSort(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('desc');
    }
    this.loadInvestments();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadInvestments();
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/dashboard/investments', id]);
  }

  onEdit(id: number): void {
    this.router.navigate(['/dashboard/investments', id, 'edit']);
  }

  onDelete(investment: InvestmentListItem): void {
    if (confirm(`Are you sure you want to delete this investment from ${investment.investorName}?`)) {
      this.investmentService.delete(investment.id).subscribe({
        next: () => {
          this.loadInvestments();
        },
        error: (err) => {
          this.error.set('Failed to delete investment. Please try again.');
          console.error('Error deleting investment:', err);
        },
      });
    }
  }

  onAddInvestment(): void {
    this.router.navigate(['/dashboard/investments', 'new']);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedPaymentStatus.set(undefined);
    this.selectedStatus.set(undefined);
    this.selectedInstrument.set(undefined);
    this.currentPage.set(1);
    this.loadInvestments();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }
}
