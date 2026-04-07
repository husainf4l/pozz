import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { ProjectStatus } from '../../core/models/project.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './overview.html',
})
export class OverviewComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);

  readonly loading = signal(true);
  readonly projects = this.projectService.myProjects;

  readonly stats = computed(() => {
    const allProjects = this.projects();
    return {
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === ProjectStatus.Active).length,
      totalFunding: allProjects.reduce((sum, p) => sum + p.currentFunding, 0),
      totalGoal: allProjects.reduce((sum, p) => sum + p.fundingGoal, 0),
    };
  });

  readonly recentProjects = computed(() => {
    return this.projects().slice(0, 3);
  });

  ngOnInit(): void {
    this.projectService.getMyProjects().subscribe({
      next: () => this.loading.set(false),
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

