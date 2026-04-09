import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EmailService, Email, EmailTemplate, EmailStatus, SendEmailDto } from '../../core/services/email.service';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './emails.html',
})
export class EmailsComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly emailService = inject(EmailService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly emails = signal<Email[]>([]);
  readonly templates = signal<EmailTemplate[]>([]);
  readonly activeTab = signal<'sent' | 'templates'>('sent');
  readonly showSendModal = signal(false);

  readonly emailForm = this.fb.group({
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    body: ['', [Validators.required, Validators.maxLength(10000)]],
    recipients: ['', [Validators.required]],
    templateId: [null as number | null],
  });

  readonly stats = computed(() => {
    const allEmails = this.emails();
    const sent = allEmails.filter(e => e.status !== 'draft').length;
    const opened = allEmails.filter(e => e.status === 'opened' || e.status === 'clicked' || e.status === 'replied').length;
    const clicked = allEmails.filter(e => e.status === 'clicked' || e.status === 'replied').length;
    const replied = allEmails.filter(e => e.status === 'replied').length;
    
    return {
      sent,
      openedPercent: sent > 0 ? Math.round((opened / sent) * 100) : 0,
      clicked,
      replied,
    };
  });

  ngOnInit(): void {
    this.loadEmails();
    this.loadTemplates();
  }

  loadEmails(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.emailService.getAll(companyId).subscribe({
      next: (emails) => {
        this.emails.set(emails);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadTemplates(): void {
    this.emailService.getTemplates().subscribe({
      next: (templates) => {
        this.templates.set(templates);
      },
    });
  }

  sendEmail(): void {
    if (this.emailForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const recipientsStr = this.emailForm.value.recipients!;
    const recipients = recipientsStr.split(',').map(r => r.trim());

    const dto: SendEmailDto = {
      subject: this.emailForm.value.subject!,
      body: this.emailForm.value.body!,
      recipients,
      templateId: this.emailForm.value.templateId || undefined,
    };

    this.emailService.send(companyId, dto).subscribe({
      next: (email) => {
        this.emails.update(emails => [email, ...emails]);
        this.emailForm.reset();
        this.showSendModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  useTemplate(template: EmailTemplate): void {
    this.emailForm.patchValue({
      subject: template.subject,
      body: template.body,
      templateId: template.id,
    });
    this.activeTab.set('sent');
    this.showSendModal.set(true);
  }

  getStatusBadge(status: EmailStatus): string {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'opened': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'clicked': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'replied': return 'bg-green-100 text-green-700 border-green-200';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
