import { Component, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  readonly authService = inject(AuthService);

  readonly stats = [
    { label: 'Projects', value: '—' },
    { label: 'Connections', value: '—' },
    { label: 'Messages', value: '—' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
