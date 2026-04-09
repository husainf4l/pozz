import { Component, OnInit, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService, SearchResults } from '../../core/services/search.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateService } from '../../core/services/translate.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search.html',
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class GlobalSearchComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly searchSubject = new Subject<string>();

  readonly query = signal('');
  readonly results = signal<SearchResults | null>(null);
  readonly isOpen = signal(false);
  readonly loading = signal(false);

  get locale(): string {
    return this.translate.currentLocale();
  }

  ngOnInit(): void {
    // Debounce search
    this.searchSubject.pipe(debounceTime(300)).subscribe(q => {
      if (q.trim().length >= 3) {
        this.performSearch(q.trim());
      } else {
        this.results.set(null);
        this.loading.set(false);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Command+K or Ctrl+K to open
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
    // Escape to close
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  openSearch(): void {
    this.isOpen.set(true);
    setTimeout(() => {
      const input = document.getElementById('global-search-input') as HTMLInputElement;
      input?.focus();
    }, 50);
  }

  closeSearch(): void {
    this.isOpen.set(false);
    this.query.set('');
    this.results.set(null);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    if (value.trim().length >= 3) {
      this.loading.set(true);
      this.searchSubject.next(value);
    } else {
      this.results.set(null);
      this.loading.set(false);
    }
  }

  performSearch(q: string): void {
    const user = this.authService.currentUser();
    if (!user?.companyId) {
      this.loading.set(false);
      return;
    }

    this.searchService.globalSearch(user.companyId, q).subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
    this.closeSearch();
  }

  getTotalResults(): number {
    const r = this.results();
    if (!r) return 0;
    return r.investors.length + r.projects.length + r.meetings.length + r.notes.length;
  }
}
