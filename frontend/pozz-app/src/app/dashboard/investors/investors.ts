import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { InvestorService } from '../../core/services/investor.service';
import {
  InvestorListItem,
  InvestorSearchRequest,
  PipelineStage,
  InvestorType,
  getPipelineStageLabel,
  getPipelineStageBadgeColor,
  getInvestorTypeLabel,
} from '../../core/models/investor.models';

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './investors.html',
})
export class InvestorsComponent implements OnInit {
  private readonly investorService = inject(InvestorService);
  private readonly router = inject(Router);

  // ── State ─────────────────────────────────────────────────────────────────
  readonly investors = signal<InvestorListItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // ── Pagination & Search ───────────────────────────────────────────────────
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);
  readonly totalCount = signal(0);
  readonly searchTerm = signal('');
  readonly selectedPipelineStage = signal<PipelineStage | undefined>(undefined);
  readonly selectedInvestorType = signal<InvestorType | undefined>(undefined);
  readonly selectedPriority = signal<number | undefined>(undefined);
  readonly sortBy = signal('lastContactDate');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  // ── Computed Values ───────────────────────────────────────────────────────
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);

  // ── Enums for Template ────────────────────────────────────────────────────
  readonly PipelineStage = PipelineStage;
  readonly InvestorType = InvestorType;

  // ── Helper Functions ──────────────────────────────────────────────────────
  readonly getPipelineStageLabel = getPipelineStageLabel;
  readonly getPipelineStageBadgeColor = getPipelineStageBadgeColor;
  readonly getInvestorTypeLabel = getInvestorTypeLabel;

  ngOnInit(): void {
    this.loadInvestors();
  }

  loadInvestors(): void {
    this.loading.set(true);
    this.error.set(null);

    const request: InvestorSearchRequest = {
      searchTerm: this.searchTerm() || undefined,
      pipelineStage: this.selectedPipelineStage(),
      investorType: this.selectedInvestorType(),
      priority: this.selectedPriority(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    this.investorService.search(request).subscribe({
      next: (result) => {
        this.investors.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load investors. Please try again.');
        this.loading.set(false);
        console.error('Error loading investors:', err);
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadInvestors();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadInvestors();
  }

  onSort(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('desc');
    }
    this.loadInvestors();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadInvestors();
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/dashboard/investors', id]);
  }

  onEdit(id: number): void {
    this.router.navigate(['/dashboard/investors', id, 'edit']);
  }

  onDelete(investor: InvestorListItem): void {
    if (confirm(`Are you sure you want to delete ${investor.userFullName}?`)) {
      this.investorService.delete(investor.id).subscribe({
        next: () => {
          this.loadInvestors();
        },
        error: (err) => {
          this.error.set('Failed to delete investor. Please try again.');
          console.error('Error deleting investor:', err);
        },
      });
    }
  }

  onAddInvestor(): void {
    this.router.navigate(['/dashboard/investors', 'new']);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedPipelineStage.set(undefined);
    this.selectedInvestorType.set(undefined);
    this.selectedPriority.set(undefined);
    this.currentPage.set(1);
    this.loadInvestors();
  }

  formatCurrency(amount: number | null): string {
    if (!amount) return '-';
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
}

