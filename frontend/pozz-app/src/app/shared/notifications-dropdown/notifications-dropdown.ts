import { Component, OnInit, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { TranslateService } from '../../core/services/translate.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-dropdown.html',
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class NotificationsDropdownComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly elementRef = inject(ElementRef);

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = this.notificationService.unreadCount;
  readonly isOpen = signal(false);
  readonly loading = signal(false);

  get locale(): string {
    return this.translate.currentLocale();
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications.set(data.slice(0, 5)); // Latest 5
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe();
  }

  toggleDropdown(): void {
    if (!this.isOpen()) {
      this.loadNotifications();
    }
    this.isOpen.set(!this.isOpen());
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.loadNotifications();
          this.loadUnreadCount();
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
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
      case 'success': return 'bg-green-500/10';
      case 'warning': return 'bg-yellow-500/10';
      case 'error': return 'bg-red-500/10';
      default: return 'bg-primary/10';
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
