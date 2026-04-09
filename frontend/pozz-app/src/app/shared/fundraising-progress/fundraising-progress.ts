import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fundraising-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fundraising-progress.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FundraisingProgressComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly goal = signal(1000000);
  readonly raised = signal(650000);
  readonly investors = signal(12);
  readonly daysRemaining = signal(45);

  readonly progress = signal(0);
  readonly percentageRaised = signal(0);
  readonly averageInvestment = signal(0);
  readonly remaining = signal(0);

  ngOnInit(): void {
    this.calculateMetrics();
    // Animate progress bar
    setTimeout(() => {
      const pct = (this.raised() / this.goal()) * 100;
      this.progress.set(Math.min(pct, 100));
    }, 100);
  }

  calculateMetrics(): void {
    const raised = this.raised();
    const goal = this.goal();
    const investorCount = this.investors();

    this.percentageRaised.set(Math.round((raised / goal) * 100));
    this.averageInvestment.set(investorCount > 0 ? Math.round(raised / investorCount) : 0);
    this.remaining.set(goal - raised);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  getMilestoneMessage(): string | null {
    const pct = this.percentageRaised();
    if (pct >= 100) return '🎉 Goal reached!';
    if (pct >= 75) return '🚀 Almost there!';
    if (pct >= 50) return '💪 Halfway there!';
    if (pct >= 25) return '📈 Great progress!';
    return null;
  }
}
