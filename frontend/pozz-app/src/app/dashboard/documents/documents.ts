import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService, Document, DocumentFolder } from '../../core/services/document.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
})
export class DocumentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly authService = inject(AuthService);
  readonly documentService = inject(DocumentService);

  readonly loading = signal(true);
  readonly uploading = signal(false);
  readonly documents = signal<Document[]>([]);
  readonly folders = signal<DocumentFolder[]>([]);
  readonly currentFolderId = signal<number | undefined>(undefined);
  readonly searchQuery = signal('');
  readonly showCreateFolderModal = signal(false);
  readonly newFolderName = signal('');
  readonly deletingId = signal<number | null>(null);

  readonly filteredDocuments = signal<Document[]>([]);

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    this.loading.set(true);
    this.documentService.getAll(companyId, this.currentFolderId()).subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.filterDocuments();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filterDocuments(): void {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredDocuments.set(this.documents());
      return;
    }
    const filtered = this.documents().filter(doc => 
      doc.name.toLowerCase().includes(query)
    );
    this.filteredDocuments.set(filtered);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.filterDocuments();
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const user = this.authService.currentUser();
    const companyId = (user as any)?.companyId || 1;
    if (!companyId) return;

    const file = input.files[0];
    this.uploading.set(true);

    this.documentService.upload(companyId, file, this.currentFolderId()).subscribe({
      next: (doc) => {
        this.documents.update(docs => [doc, ...docs]);
        this.filterDocuments();
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
        input.value = '';
      },
    });
  }

  deleteDocument(id: number): void {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.deletingId.set(id);
    this.documentService.delete(id).subscribe({
      next: () => {
        this.documents.update(docs => docs.filter(d => d.id !== id));
        this.filterDocuments();
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  createFolder(): void {
    const name = this.newFolderName().trim();
    if (!name) return;

    // In a real app, you'd call an API endpoint
    // For now, we'll just close the modal
    this.showCreateFolderModal.set(false);
    this.newFolderName.set('');
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('zip') || fileType.includes('archive')) return '📦';
    return '📎';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }
}
