"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { documentsService } from "@/lib/services/documents"
import { 
  Upload, 
  Folder, 
  File, 
  Download, 
  Share2, 
  Trash2, 
  Plus,
  FileText,
  Search
} from "lucide-react"
import type { Document, Folder as FolderType } from "@/lib/types/api"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<FolderType[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await documentsService.getAll({
        page: 1,
        pageSize: 100,
        folderId: currentFolder || undefined,
      })
      setDocuments(response.data)
      const folderData = await documentsService.getFolders()
      setFolders(folderData)
    } catch (err) {
      console.error("Failed to load documents:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [currentFolder])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await documentsService.upload(file, {
        name: file.name,
        type: 'other',
        folderId: currentFolder || undefined,
      })
      await loadDocuments()
    } catch (err: any) {
      alert(err.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCreateFolder = async () => {
    const name = prompt("Folder name:")
    if (!name) return

    try {
      await documentsService.createFolder(name, currentFolder || undefined)
      await loadDocuments()
    } catch (err: any) {
      alert(err.message || "Failed to create folder")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await documentsService.delete(id)
      await loadDocuments()
    } catch (err: any) {
      alert(err.message || "Failed to delete document")
    }
  }

  const handleShare = async (id: string) => {
    const emails = prompt("Enter email addresses (comma-separated):")
    if (!emails) return

    try {
      await documentsService.share(id, emails.split(',').map(e => e.trim()))
      alert("Document shared successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to share document")
    }
  }

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pitch_deck':
      case 'financial':
        return <FileText className="w-8 h-8 text-green-600 dark:text-green-500" />
      case 'legal':
        return <File className="w-8 h-8 text-red-600 dark:text-red-500" />
      default:
        return <FileText className="w-8 h-8 text-blue-600 dark:text-blue-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingCard />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentFolder ? 'Folder view' : 'All documents'} • {filteredDocs.length} files
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateFolder} variant="outline">
              <Folder className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Breadcrumb */}
        {currentFolder && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentFolder(null)}
              className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            >
              All Documents
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Current Folder</span>
          </div>
        )}

        {/* Folders */}
        {!currentFolder && folders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className="p-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-500 transition-all"
              >
                <Folder className="w-12 h-12 text-red-600 dark:text-red-500 mb-3" />
                <p className="font-medium text-gray-900 dark:text-white">
                  {folder.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                {getFileIcon(doc.type)}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(doc.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                {doc.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{formatFileSize(doc.size)}</span>
                <span>v{doc.version}</span>
              </div>
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <File className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No documents yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload your first document to get started
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
