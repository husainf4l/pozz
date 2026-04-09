import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProposalService, Proposal, ProposalStatus, CreateProposalDto } from '../../core/services/proposal.service';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './proposals.html',
})
export class ProposalsComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly proposalService = inject(ProposalService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly proposals = signal<Proposal[]>([]);
  readonly statusFilter = signal<ProposalStatus | 'all'>('all');
  readonly showCreateModal = signal(false);
  readonly sendingId = signal<number | null>(null);

  readonly proposalForm = this.fb.group({
    investorId: [0, [Validators.required, Validators.min(1)]],
    projectId: [0, [Validators.required, Validators.min(1)]],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    equityOffered: [0, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    valuation: [0, [Validators.required, Validators.min(1)]],
  });

  readonly filteredProposals = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'all') return this.proposals();
    return this.proposals().filter(p => p.status === filter);
  });

  readonly stats = computed(() => {
    const allProposals = this.proposals();
    return {
      total: allProposals.length,
      drafts: allProposals.filter(p => p.status === 'draft').length,
      accepted: allProposals.filter(p => p.status === 'accepted').length,
      totalCommitted: allProposals
        .filter(p => p.status === 'accepted')
        .reduce((sum, p) => sum + p.amount, 0),
    };
  });

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.proposalService.getAll(companyId).subscribe({
      next: (proposals) => {
        this.proposals.set(proposals);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createProposal(): void {
    if (this.proposalForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateProposalDto = {
      investorId: this.proposalForm.value.investorId!,
      projectId: this.proposalForm.value.projectId!,
      title: this.proposalForm.value.title!,
      description: this.proposalForm.value.description!,
      amount: this.proposalForm.value.amount!,
      equityOffered: this.proposalForm.value.equityOffered!,
      valuation: this.proposalForm.value.valuation!,
    };

    this.proposalService.create(companyId, dto).subscribe({
      next: (proposal) => {
        this.proposals.update(proposals => [proposal, ...proposals]);
        this.proposalForm.reset();
        this.showCreateModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  sendProposal(id: number): void {
    if (!confirm('Are you sure you want to send this proposal?')) return;

    this.sendingId.set(id);
    this.proposalService.send(id).subscribe({
      next: (updatedProposal) => {
        this.proposals.update(proposals => 
          proposals.map(p => p.id === id ? updatedProposal : p)
        );
        this.sendingId.set(null);
      },
      error: () => this.sendingId.set(null),
    });
  }

  deleteProposal(id: number): void {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    this.proposalService.delete(id).subscribe({
      next: () => {
        this.proposals.update(proposals => proposals.filter(p => p.id !== id));
      },
    });
  }

  getStatusBadge(status: ProposalStatus): { icon: string; class: string } {
    switch (status) {
      case 'draft':
        return {
          icon: '📝',
          class: 'bg-gray-100 text-gray-700 border-gray-200'
        };
      case 'sent':
        return {
          icon: '📤',
          class: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'viewed':
        return {
          icon: '👁️',
          class: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      case 'accepted':
        return {
          icon: '✅',
          class: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'rejected':
        return {
          icon: '❌',
          class: 'bg-red-100 text-red-700 border-red-200'
        };
    }
  }

  getStatusColor(status: ProposalStatus): string {
    switch (status) {
      case 'draft': return 'text-gray-600';
      case 'sent': return 'text-blue-600';
      case 'viewed': return 'text-yellow-600';
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
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
