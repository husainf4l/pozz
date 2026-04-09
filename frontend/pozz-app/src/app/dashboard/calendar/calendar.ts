import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CalendarService, CalendarEvent, CalendarEventType, CreateCalendarEventDto } from '../../core/services/calendar.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

type CalendarView = 'month' | 'week' | 'day';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calendar.html',
})
export class CalendarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly calendarService = inject(CalendarService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly events = signal<CalendarEvent[]>([]);
  readonly currentDate = signal(new Date());
  readonly view = signal<CalendarView>('month');
  readonly selectedDay = signal<Date | null>(null);
  readonly showCreateModal = signal(false);

  readonly eventTypes: CalendarEventType[] = ['meeting', 'deadline', 'reminder', 'other'];

  readonly eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
    type: ['meeting' as CalendarEventType, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    location: [''],
  });

  readonly calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = this.getFirstDayOfMonth(year, month);
    const daysInMonth = this.getDaysInMonth(year, month);
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  });

  readonly selectedDayEvents = computed(() => {
    const selected = this.selectedDay();
    if (!selected) return [];
    
    const selectedDate = selected.toDateString();
    return this.events().filter(event => {
      const eventDate = new Date(event.startTime).toDateString();
      return eventDate === selectedDate;
    });
  });

  readonly monthName = computed(() => {
    return this.currentDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.calendarService.getEvents(companyId).subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createEvent(): void {
    if (this.eventForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateCalendarEventDto = {
      title: this.eventForm.value.title!,
      description: this.eventForm.value.description || undefined,
      type: this.eventForm.value.type!,
      startTime: this.eventForm.value.startTime!,
      endTime: this.eventForm.value.endTime!,
      location: this.eventForm.value.location || undefined,
    };

    this.calendarService.create(companyId, dto).subscribe({
      next: (event) => {
        this.events.update(events => [...events, event]);
        this.eventForm.reset({ type: 'meeting' });
        this.showCreateModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  deleteEvent(id: number): void {
    if (!confirm('Are you sure you want to delete this event?')) return;

    this.calendarService.delete(id).subscribe({
      next: () => {
        this.events.update(events => events.filter(e => e.id !== id));
      },
    });
  }

  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  today(): void {
    this.currentDate.set(new Date());
  }

  selectDay(date: Date | null): void {
    if (date) {
      this.selectedDay.set(date);
    }
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  hasEvents(date: Date | null): boolean {
    if (!date) return false;
    const dateString = date.toDateString();
    return this.events().some(event => 
      new Date(event.startTime).toDateString() === dateString
    );
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date | null): boolean {
    if (!date) return false;
    const selected = this.selectedDay();
    return selected ? date.toDateString() === selected.toDateString() : false;
  }

  getEventTypeBadgeColor(type: CalendarEventType): string {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'other': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  }
}
