import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SettingsService } from '../../core/services/settings.service';
import { TeamService, TeamRole } from '../../core/services/team.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly settingsService = inject(SettingsService);
  private readonly teamService = inject(TeamService);

  readonly activeTab = signal<'profile' | 'account' | 'notifications' | 'integrations' | 'team' | 'billing'>('profile');
  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    title: [''],
    bio: [''],
  });

  readonly accountForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    twoFactorEnabled: [false],
  });

  readonly notificationSettings = signal({
    email: true,
    push: true,
    investorUpdates: true,
    projectMilestones: true,
    teamActivity: true,
    emailNotifications: true,
    projectUpdates: true,
    messageNotifications: true,
    investmentAlerts: true,
    taskReminders: true,
    calendarEvents: true,
    documentSharing: true,
    proposalUpdates: true,
    marketingEmails: false,
  });

  readonly integrationSettings = signal({
    googleCalendar: { connected: false, email: '' },
    outlook: { connected: false, email: '' },
    slack: { connected: false, webhookUrl: '' },
    salesforce: false,
    hubspot: false,
    stripe: false,
    plaid: false,
  });

  readonly teamMembers = signal<any[]>([]);
  readonly teamLoading = signal(false);

  readonly billingPlans = signal([
    { id: 'starter', name: 'Starter', price: 29, features: ['Up to 10 team members', 'Basic features', '5GB storage'] },
    { id: 'professional', name: 'Professional', price: 99, features: ['Up to 50 team members', 'Advanced features', '50GB storage', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Unlimited team members', 'All features', 'Unlimited storage', '24/7 support'] },
  ]);
  readonly currentPlan = signal('professional');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
    this.loadTeamMembers();
  }

  setActiveTab(tab: 'profile' | 'account' | 'notifications' | 'integrations' | 'team' | 'billing'): void {
    this.activeTab.set(tab);
    this.clearMessages();
    if (tab === 'team') {
      this.loadTeamMembers();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const { firstName, lastName } = this.profileForm.value;
    if (!firstName || !lastName) return;

    this.saving.set(true);
    this.clearMessages();

    this.userService.updateProfile({ firstName, lastName }).subscribe({
      next: (updated) => {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.authService.updateCurrentUser({
            ...currentUser,
            firstName: updated.firstName,
            lastName: updated.lastName,
          });
        }
        this.saving.set(false);
        this.successMessage.set('Profile updated successfully!');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to update profile. Please try again.');
        console.error('Error updating profile:', err);
      },
    });
  }

  changePassword(): void {
    if (this.accountForm.invalid) return;

    const { newPassword, confirmPassword } = this.accountForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.saving.set(true);
    this.clearMessages();

    setTimeout(() => {
      this.saving.set(false);
      this.successMessage.set('Password changed successfully!');
      this.accountForm.reset();
      setTimeout(() => this.clearMessages(), 3000);
    }, 1000);
  }

  toggleNotification(key: string): void {
    this.notificationSettings.update(settings => ({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    }));
  }

  saveNotifications(): void {
    this.saving.set(true);
    this.clearMessages();

    this.settingsService.updateNotifications(this.notificationSettings()).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Notification preferences saved successfully!');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set('Failed to save notification preferences.');
        console.error('Error saving notifications:', err);
      },
    });
  }

  toggleIntegration(key: string): void {
    const current = this.integrationSettings();
    const value = current[key as keyof typeof current];
    
    if (typeof value === 'boolean') {
      this.integrationSettings.update(s => ({ ...s, [key]: !value }));
    } else if (value && 'connected' in value) {
      this.integrationSettings.update(s => ({
        ...s,
        [key]: { ...value, connected: !value.connected },
      }));
    }
  }

  saveIntegrations(): void {
    this.saving.set(true);
    this.clearMessages();

    this.settingsService.updateIntegrations(this.integrationSettings()).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Integration settings saved successfully!');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set('Failed to save integration settings.');
        console.error('Error saving integrations:', err);
      },
    });
  }

  loadTeamMembers(): void {
    this.teamLoading.set(true);
    const companyId = this.authService.currentUser()?.companyId;
    if (!companyId) {
      this.teamLoading.set(false);
      return;
    }

    this.teamService.getMembers(companyId).subscribe({
      next: (members) => {
        this.teamMembers.set(members);
        this.teamLoading.set(false);
      },
      error: (err) => {
        this.teamLoading.set(false);
        console.error('Error loading team members:', err);
      },
    });
  }

  inviteTeamMember(email: string, role: TeamRole): void {
    const companyId = this.authService.currentUser()?.companyId;
    if (!companyId) return;

    this.teamService.invite(companyId, { email, role }).subscribe({
      next: () => {
        this.successMessage.set('Team member invited successfully!');
        this.loadTeamMembers();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Failed to invite team member.');
        console.error('Error inviting team member:', err);
      },
    });
  }

  removeTeamMember(userId: number): void {
    const companyId = this.authService.currentUser()?.companyId;
    if (!companyId) return;

    if (confirm('Are you sure you want to remove this team member?')) {
      this.teamService.remove(companyId, userId).subscribe({
        next: () => {
          this.successMessage.set('Team member removed successfully!');
          this.loadTeamMembers();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err) => {
          this.errorMessage.set('Failed to remove team member.');
          console.error('Error removing team member:', err);
        },
      });
    }
  }

  updateTeamMemberRole(userId: number, role: TeamRole): void {
    const companyId = this.authService.currentUser()?.companyId;
    if (!companyId) return;

    this.teamService.updateRole(companyId, userId, role).subscribe({
      next: () => {
        this.successMessage.set('Team member role updated successfully!');
        this.loadTeamMembers();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        this.errorMessage.set('Failed to update role.');
        console.error('Error updating role:', err);
      },
    });
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
