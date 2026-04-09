"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, FolderKanban, ExternalLink, FileText, Link as LinkIcon, Edit, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { projectsService } from "@/lib/services/projects"
import { LoadingGrid, LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage, EmptyState } from "@/components/error-states"
import type { Project } from "@/lib/types/api"

const mockProjects = [
  {
    id: 1,
    name: "Pozz.io - Fundraising Platform",
    description: "AI-powered fundraising management platform for startups",
    stage: "Series A",
    targetAmount: "$2M",
    raisedAmount: "$1.2M",
    progress: 60,
    status: "Active",
    investors: 12,
    materials: 8,
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "TechVenture 2024",
    description: "SaaS platform for enterprise resource planning",
    stage: "Seed",
    targetAmount: "$500K",
    raisedAmount: "$300K",
    progress: 60,
    status: "Active",
    investors: 5,
    materials: 6,
    updatedAt: "1 day ago",
  },
  {
    id: 3,
    name: "EcoTech Solutions",
    description: "Sustainable energy management platform",
    stage: "Pre-Seed",
    targetAmount: "$250K",
    raisedAmount: "$150K",
    progress: 60,
    status: "Active",
    investors: 8,
    materials: 4,
    updatedAt: "3 days ago",
  },
]

const materials = [
  { name: "Pitch Deck", type: "PDF", size: "4.2 MB", icon: FileText },
  { name: "Financial Projections", type: "Excel", size: "1.8 MB", icon: FileText },
  { name: "Product Demo", type: "Video", size: "45 MB", icon: FileText },
  { name: "Executive Summary", type: "PDF", size: "890 KB", icon: FileText },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await projectsService.getAll({ page: 1, pageSize: 50 })
      setProjects(response.data)
    } catch (err: any) {
      console.error("Failed to load projects:", err)
      setError(err.message || "Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2 || searchQuery.length === 0) {
        loadProjects()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    try {
      await projectsService.delete(id)
      await loadProjects()
    } catch (err: any) {
      alert(err.message || "Failed to delete project")
    }
  }

  const handleFileUpload = async (projectId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(projectId)
      await projectsService.uploadMaterial(projectId, file)
      alert("File uploaded successfully")
    } catch (err: any) {
      alert(err.message || "Failed to upload file")
    } finally {
      setUploadingFile(null)
    }
   }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your fundraising projects and materials
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
          />
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <LoadingGrid items={4} />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            message={searchQuery ? "Try adjusting your search" : "Get started by creating your first project"}
            action={{ label: "New Project", onClick: () => alert("Create project modal") }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-600/5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center transition-all group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Stage
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {project.stage}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </div>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Fundraising Progress
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.raisedAmount} / {project.targetAmount}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{project.investors} investors</span>
                  <span>{project.materials} materials</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {project.updatedAt}
                </span>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Materials Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Project Materials
            </h2>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {materials.map((material, index) => {
              const Icon = material.icon
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-all" />
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {material.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {material.type} • {material.size}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer group">
            <LinkIcon className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              External Links
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage project URLs and external resources
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer group">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Documentation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access project documents and reports
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer group">
            <FolderKanban className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Project Templates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create projects from pre-built templates
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
