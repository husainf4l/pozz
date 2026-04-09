import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { InvestmentService } from '../../core/services/investment.service';
import { InvestorService } from '../../core/services/investor.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { FundraisingProgressComponent } from '../../shared/fundraising-progress/fundraising-progress';
import { ProjectStatus } from '../../core/models/project.models';
import { PipelineStage } from '../../core/models/investor.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, FundraisingProgressComponent],
  templateUrl: './overview.html',
})
export class OverviewComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);
  readonly investmentService = inject(InvestmentService);
  readonly investorService = inject(InvestorService);

  readonly loading = signal(true);
  readonly projects = this.projectService.myProjects;
  readonly investors = this.investorService.investors;
  readonly totalRaised = signal<number>(0);

  readonly stats = computed(() => {
    const allProjects = this.projects();
    return {
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === ProjectStatus.Active).length,
      totalFunding: allProjects.reduce((sum, p) => sum + p.currentFunding, 0),
      totalGoal: allProjects.reduce((sum, p) => sum + p.fundingGoal, 0),
    };
  });

  readonly investorStats = computed(() => {
    const allInvestors = this.investors();
    const pipelineCounts: Record<PipelineStage, number> = {
      [PipelineStage.Target]: 0,
      [PipelineStage.Contacted]: 0,
      [PipelineStage.Pitched]: 0,
      [PipelineStage.DueDiligence]: 0,
      [PipelineStage.TermSheet]: 0,
      [PipelineStage.Committed]: 0,
      [PipelineStage.Invested]: 0,
      [PipelineStage.Passed]: 0,
      [PipelineStage.Inactive]: 0,
    };

    allInvestors.forEach(inv => {
      pipelineCounts[inv.pipelineStage]++;
    });

    return {
      totalInvestors: allInvestors.length,
      activeInvestors: allInvestors.filter(inv => inv.pipelineStage !== PipelineStage.Inactive).length,
      pipelineCounts,
    };
  });

  readonly pipelineDistribution = computed(() => {
    const counts = this.investorStats().pipelineCounts;
    const total = this.investorStats().totalInvestors;
    if (total === 0) return [];

    return [
      { stage: 'Target', count: counts[PipelineStage.Target], percentage: (counts[PipelineStage.Target] / total) * 100, color: 'bg-gray-400' },
      { stage: 'Contacted', count: counts[PipelineStage.Contacted], percentage: (counts[PipelineStage.Contacted] / total) * 100, color: 'bg-blue-400' },
      { stage: 'Pitched', count: counts[PipelineStage.Pitched], percentage: (counts[PipelineStage.Pitched] / total) * 100, color: 'bg-purple-400' },
      { stage: 'Due Diligence', count: counts[PipelineStage.DueDiligence], percentage: (counts[PipelineStage.DueDiligence] / total) * 100, color: 'bg-yellow-400' },
      { stage: 'Term Sheet', count: counts[PipelineStage.TermSheet], percentage: (counts[PipelineStage.TermSheet] / total) * 100, color: 'bg-orange-400' },
      { stage: 'Committed', count: counts[PipelineStage.Committed], percentage: (counts[PipelineStage.Committed] / total) * 100, color: 'bg-green-400' },
      { stage: 'Invested', count: counts[PipelineStage.Invested], percentage: (counts[PipelineStage.Invested] / total) * 100, color: 'bg-emerald-600' },
    ].filter(item => item.count > 0);
  });

  readonly recentProjects = computed(() => {
    return this.projects().slice(0, 3);
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const companyId = user?.companyId || 1;

    forkJoin({
      projects: this.projectService.getMyProjects(),
      totalRaised: this.investmentService.getTotalRaised(companyId),
      investors: this.investorService.search({ companyId, page: 1, pageSize: 1000 }),
    }).subscribe({
      next: (results) => {
        this.totalRaised.set(results.totalRaised.totalRaised || 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
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

  getFundingProgress(current: number, goal: number): number {
    return Math.min(100, (current / goal) * 100);
  }
}

