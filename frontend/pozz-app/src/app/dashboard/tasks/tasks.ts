import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TaskService, Task, TaskStatus, TaskPriority, CreateTaskDto } from '../../core/services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly taskService = inject(TaskService);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly tasks = signal<Task[]>([]);
  readonly statusFilter = signal<TaskStatus | 'all'>('all');
  readonly showCreateForm = signal(false);

  readonly taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
    priority: ['medium' as TaskPriority, Validators.required],
    dueDate: [''],
  });

  readonly priorities: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];

  readonly filteredTasks = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'all') return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  readonly stats = computed(() => {
    const allTasks = this.tasks();
    const now = new Date();
    
    return {
      todo: allTasks.filter(t => t.status === 'todo').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      overdue: allTasks.filter(t => 
        t.status !== 'completed' && 
        t.dueDate && 
        new Date(t.dueDate) < now
      ).length,
    };
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.taskService.getAll(companyId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createTask(): void {
    if (this.taskForm.invalid) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.submitting.set(true);
    const dto: CreateTaskDto = {
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description || undefined,
      priority: this.taskForm.value.priority!,
      dueDate: this.taskForm.value.dueDate || undefined,
    };

    this.taskService.create(companyId, dto).subscribe({
      next: (task) => {
        this.tasks.update(tasks => [task, ...tasks]);
        this.taskForm.reset({ priority: 'medium' });
        this.showCreateForm.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  completeTask(id: number): void {
    this.taskService.complete(id).subscribe({
      next: (updatedTask) => {
        this.tasks.update(tasks => 
          tasks.map(t => t.id === id ? updatedTask : t)
        );
      },
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      },
    });
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
