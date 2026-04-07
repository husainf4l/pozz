import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './overview.html',
})
export class OverviewComponent {
  readonly authService = inject(AuthService);

  readonly statKeys = ['dashboard.stats.projects', 'dashboard.stats.connections', 'dashboard.stats.messages'];
}
