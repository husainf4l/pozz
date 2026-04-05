import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, ThemeToggleComponent, LangSwitcherComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly translate = inject(TranslateService);

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  selectedRole = signal<'Investor' | 'ProjectOwner'>('Investor');
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  setRole(role: 'Investor' | 'ProjectOwner'): void {
    this.selectedRole.set(role);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { firstName, lastName, email, password } = this.form.getRawValue();

    this.authService
      .register({
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
        role: this.selectedRole(),
      })
      .subscribe({
        next: () => this.loading.set(false), // AuthService.navigateAfterAuth() handles routing
        error: (err) => {
          this.errorMessage.set(
            err?.error?.error ?? this.translate.t('auth.register.registrationFailed'),
          );
          this.loading.set(false);
        },
      });
  }

  get firstNameCtrl() {
    return this.form.controls.firstName;
  }
  get lastNameCtrl() {
    return this.form.controls.lastName;
  }
  get emailCtrl() {
    return this.form.controls.email;
  }
  get passwordCtrl() {
    return this.form.controls.password;
  }

  get loginRoute(): string {
    return `/${this.translate.currentLocale()}/auth/login`;
  }
}
