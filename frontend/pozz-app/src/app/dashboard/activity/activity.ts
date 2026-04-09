import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService, Activity, ActivityEntityType } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './activity.html',
})
export class ActivityComponent implements OnInit {
  private readonly activityService = inject(ActivityService);
  private readonly authService = inject(AuthService);

  readonly allActivities = signal<Activity[]>([]);
  readonly loading = signal(true);
  readonly filter = signal<ActivityEntityType | 'all'>('all');

  readonly activities = computed(() => {
    const all = this.allActivities();
    const f = this.filter();
    return f === 'all' ? all : all.filter(a => a.entityType === f);
  });

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    const user = this.authService.currentUser();
    if (!user?.companyId) return;

    this.loading.set(true);
    this.activityService.getAll(user.companyId).subscribe({
      next: (data) => {
        this.allActivities.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: ActivityEntityType | 'all'): void {
    this.filter.set(f);
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'created': return '+';
      case 'updated': return '↻';
      case 'deleted': return '×';
      case 'shared': return '→';
      case 'commented': return '💬';
      default: return '•';
    }
  }

  getActionColor(action: string): string {
    switch (action) {
      case 'created': return 'text-green-500 bg-green-500/10';
      case 'updated': return 'text-blue-500 bg-blue-500/10';
      case 'deleted': return 'text-red-500 bg-red-500/10';
      case 'shared': return 'text-purple-500 bg-purple-500/10';
      case 'commented': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  }

  getEntityIcon(entityType: string): string {
    switch (entityType) {
      case 'investor': return '👤';
      case 'project': return '📁';
      case 'meeting': return '📅';
      case 'deal': return '💼';
      case 'note': return '📝';
      case 'document': return '📄';
      default: return '•';
    }
  }

  getTimeAgo(date: string): string {
    const now = new Date().getTime();
    const activityTime = new Date(date).getTime();
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}
