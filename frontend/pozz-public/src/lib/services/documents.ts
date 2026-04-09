/**
 * Documents Service
 * API service layer for document management operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { 
  Document, 
  Folder,
  CreateDocumentDto,
  PaginatedResponse 
} from "@/lib/types/api"

export const documentsService = {
  /**
   * Get all documents
   */
  async getAll(params?: { 
    page?: number
    pageSize?: number
    folderId?: string
    type?: string
    tags?: string[]
  }): Promise<PaginatedResponse<Document>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.folderId) queryParams.append('folderId', params.folderId)
    if (params?.type) queryParams.append('type', params.type)
    if (params?.tags) params.tags.forEach(tag => queryParams.append('tags', tag))

    const endpoint = `${API_ENDPOINTS.documents.list}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Document>>(endpoint)
  },

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<Document> {
    return client.get(API_ENDPOINTS.documents.byId.replace(':id', id))
  },

  /**
   * Upload document
   */
  async upload(file: File, data: CreateDocumentDto): Promise<Document> {
    return client.upload(API_ENDPOINTS.documents.upload, file, data)
  },

  /**
   * Share document
   */
  async share(id: string, emails: string[], expiresAt?: string): Promise<void> {
    return client.post(
      API_ENDPOINTS.documents.share.replace(':id', id),
      { emails, expiresAt }
    )
  },

  /**
   * Download document
   */
  async download(id: string): Promise<Blob> {
    return client.get(API_ENDPOINTS.documents.download.replace(':id', id))
  },

  /**
   * Delete document
   */
  async delete(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.documents.byId.replace(':id', id))
  },

  /**
   * Get folders
   */
  async getFolders(): Promise<Folder[]> {
    return client.get(API_ENDPOINTS.documents.folders)
  },

  /**
   * Create folder
   */
  async createFolder(name: string, parentId?: string): Promise<Folder> {
    return client.post(API_ENDPOINTS.documents.folders, { name, parentId })
  },
}
