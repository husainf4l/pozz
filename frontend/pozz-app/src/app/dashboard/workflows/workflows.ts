import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { WorkflowService, Workflow, TriggerType, ActionType, CreateWorkflowDto } from '../../core/services/workflow.service';

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './workflows.html',
})
export class WorkflowsComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly workflowService = inject(WorkflowService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly workflows = signal<Workflow[]>([]);
  readonly showCreateModal = signal(false);
  readonly togglingId = signal<number | null>(null);

  readonly triggerTypes: TriggerType[] = ['investor_added', 'investment_received', 'project_updated', 'meeting_scheduled', 'document_uploaded'];
  readonly actionTypes: ActionType[] = ['send_email', 'create_task', 'send_notification', 'update_status', 'create_activity'];

  readonly workflowForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
    triggerType: ['investor_added' as TriggerType, Validators.required],
    actionType: ['send_email' as ActionType, Validators.required],
  });

  readonly stats = computed(() => {
    const allWorkflows = this.workflows();
    return {
      total: allWorkflows.length,
      active: allWorkflows.filter(w => w.isActive).length,
      paused: allWorkflows.filter(w => !w.isActive).length,
    };
  });

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.workflowService.getAll(companyId).subscribe({
      next: (workflows) => {
        this.workflows.set(workflows);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createWorkflow(): void {
    if (this.workflowForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateWorkflowDto = {
      name: this.workflowForm.value.name!,
      description: this.workflowForm.value.description || undefined,
      trigger: {
        type: this.workflowForm.value.triggerType!,
        config: {},
      },
      actions: [{
        type: this.workflowForm.value.actionType!,
        config: {},
      }],
    };

    this.workflowService.create(companyId, dto).subscribe({
      next: (workflow) => {
        this.workflows.update(workflows => [workflow, ...workflows]);
        this.workflowForm.reset({ triggerType: 'investor_added', actionType: 'send_email' });
        this.showCreateModal.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  toggleWorkflow(id: number): void {
    this.togglingId.set(id);
    this.workflowService.toggle(id).subscribe({
      next: (updatedWorkflow) => {
        this.workflows.update(workflows => 
          workflows.map(w => w.id === id ? updatedWorkflow : w)
        );
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  deleteWorkflow(id: number): void {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    this.workflowService.delete(id).subscribe({
      next: () => {
        this.workflows.update(workflows => workflows.filter(w => w.id !== id));
      },
    });
  }

  getTriggerLabel(type: TriggerType): string {
    switch (type) {
      case 'investor_added': return 'Investor Added';
      case 'investment_received': return 'Investment Received';
      case 'project_updated': return 'Project Updated';
      case 'meeting_scheduled': return 'Meeting Scheduled';
      case 'document_uploaded': return 'Document Uploaded';
    }
  }

  getActionLabel(type: ActionType): string {
    switch (type) {
      case 'send_email': return 'Send Email';
      case 'create_task': return 'Create Task';
      case 'send_notification': return 'Send Notification';
      case 'update_status': return 'Update Status';
      case 'create_activity': return 'Create Activity';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
