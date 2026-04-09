import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './notifications.html',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  readonly allNotifications = signal<Notification[]>([]);
  readonly loading = signal(true);
  readonly filter = signal<'all' | 'unread'>('all');

  readonly notifications = computed(() => {
    const all = this.allNotifications();
    return this.filter() === 'unread' 
      ? all.filter(n => !n.isRead)
      : all;
  });

  readonly unreadCount = computed(() => 
    this.allNotifications().filter(n => !n.isRead).length
  );

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.allNotifications.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: 'all' | 'unread'): void {
    this.filter.set(f);
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => this.loadNotifications()
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => this.loadNotifications()
    });
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ⓘ';
    }
  }

  getTypeBg(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-primary';
    }
  }

  getTimeAgo(date: string): string {
    const now = new Date().getTime();
    const notifTime = new Date(date).getTime();
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}
