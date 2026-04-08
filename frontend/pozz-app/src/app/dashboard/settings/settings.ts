import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

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

  readonly activeTab = signal<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    dateOfBirth: [''],
    nationality: [''],
    country: [''],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  readonly notificationSettings = signal({
    emailNotifications: true,
    projectUpdates: true,
    messageNotifications: true,
    investmentAlerts: true,
    marketingEmails: false,
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }

  setActiveTab(tab: 'profile' | 'security' | 'notifications' | 'preferences'): void {
    this.activeTab.set(tab);
    this.clearMessages();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const { firstName, lastName } = this.profileForm.value;
    if (!firstName || !lastName) return;

    this.saving.set(true);
    this.clearMessages();

    this.userService.updateProfile({ firstName, lastName }).subscribe({
      next: (updated) => {
        // Update the current user in AuthService
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
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.saving.set(true);
    this.clearMessages();

    // Simulate API call
    setTimeout(() => {
      this.saving.set(false);
      this.successMessage.set('Password changed successfully!');
      this.passwordForm.reset();
      setTimeout(() => this.clearMessages(), 3000);
    }, 1000);
  }

  toggleNotification(key: keyof typeof this.notificationSettings extends Function ? never : string): void {
    this.notificationSettings.update(settings => ({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    }));
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}

