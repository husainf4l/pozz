"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, Tag, Calendar, Users, FileText, Edit, Trash2, Pin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { notesService } from "@/lib/services/meetings"
import { LoadingGrid } from "@/components/loading-states"
import { ErrorMessage, EmptyState } from "@/components/error-states"
import type { Note } from "@/lib/types/api"

const mockNotes = [
  {
    id: 1,
    title: "Key Talking Points for Acme Ventures",
    content: "Focus on our rapid user growth (300% YoY) and strong unit economics. Emphasize the $2M ARR milestone achieved ahead of schedule. Mention strategic partnerships with Fortune 500 companies.",
    tags: ["Pitch", "Acme Ventures", "Important"],
    linkedTo: "John Smith - Acme Ventures",
    linkedType: "Investor",
    createdAt: "2 hours ago",
    updatedAt: "1 hour ago",
    isPinned: true,
    isFavorite: false,
  },
  {
    id: 2,
    title: "Meeting Notes - Sarah Johnson",
    content: "Sarah showed strong interest in our TAM expansion strategy. Requested detailed competitive analysis and customer retention metrics. Follow up with case studies from top 5 customers. She mentioned potential intro to other partners.",
    tags: ["Meeting Notes", "Tech Capital", "Follow-up"],
    linkedTo: "Sarah Johnson - Tech Capital",
    linkedType: "Investor",
    createdAt: "5 hours ago",
    updatedAt: "5 hours ago",
    isPinned: false,
    isFavorite: true,
  },
  {
    id: 3,
    title: "Product Roadmap Highlights",
    content: "Q2: Launch mobile app (iOS/Android). Q3: Enterprise features (SSO, advanced analytics). Q4: API marketplace and integrations. Focus on AI-powered features that differentiate us from competitors.",
    tags: ["Product", "Roadmap", "Investor Deck"],
    linkedTo: null,
    linkedType: null,
    createdAt: "1 day ago",
    updatedAt: "1 day ago",
    isPinned: true,
    isFavorite: false,
  },
  {
    id: 4,
    title: "Investor Questions & Answers",
    content: "Q: What's your customer acquisition cost? A: $450 with 18-month payback. Q: Churn rate? A: <5% annually for enterprise. Q: How do you handle data security? A: SOC 2 Type II certified, GDPR compliant.",
    tags: ["FAQ", "Due Diligence"],
    linkedTo: null,
    linkedType: null,
    createdAt: "2 days ago",
    updatedAt: "2 days ago",
    isPinned: false,
    isFavorite: true,
  },
  {
    id: 5,
    title: "Competitive Analysis Notes",
    content: "Main competitors: CompanyA (focused on SMB), CompanyB (enterprise only). Our differentiation: vertical AI, better UX, faster time-to-value. Pricing: 30% lower with more features.",
    tags: ["Competition", "Strategy"],
    linkedTo: null,
    linkedType: null,
    createdAt: "3 days ago",
    updatedAt: "3 days ago",
    isPinned: false,
    isFavorite: false,
  },
  {
    id: 6,
    title: "Term Sheet Discussion Points",
    content: "Valuation: $15M pre-money. Investor taking 15% equity. Board seat included. Pro-rata rights for future rounds. Liquidation preference: 1x non-participating. Vesting: standard 4-year with 1-year cliff.",
    tags: ["Legal", "Term Sheet", "Important"],
    linkedTo: "Sarah Johnson - Tech Capital",
    linkedType: "Investor",
    createdAt: "4 days ago",
    updatedAt: "3 days ago",
    isPinned: false,
    isFavorite: true,
  },
]

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<"all" | "pinned" | "favorites">("all")
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await notesService.getAll({
        page: 1,
        pageSize: 100,
        tags: selectedTag ? [selectedTag] : undefined,
        search: searchQuery || undefined,
      })
      setNotes(response.data)
    } catch (err: any) {
      console.error("Failed to load notes:", err)
      setError(err.message || "Failed to load notes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [selectedTag])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2 || searchQuery.length === 0) {
        loadNotes()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return
    
    try {
      await notesService.delete(id)
      await loadNotes()
    } catch (err: any) {
      alert(err.message || "Failed to delete note")
    }
  }

  const handleTogglePin = async (id: string) => {
    try {
      await notesService.togglePin(id)
      await loadNotes()
    } catch (err: any) {
      alert(err.message || "Failed to toggle pin")
    }
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      await notesService.toggleFavorite(id)
      await loadNotes()
    } catch (err: any) {
      alert(err.message || "Failed to toggle favorite")
    }
  }

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])))

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "pinned" ? note.isPinned :
      filterType === "favorites" ? note.isFavorite : true
    
    return matchesSearch && matchesTag && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize your ideas, meeting notes, and important information
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {notes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Notes
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {notes.filter(n => n.isPinned).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pinned
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {notes.filter(n => n.isFavorite).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Favorites
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {allTags.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tags
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setFilterType("pinned")}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filterType === "pinned"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Pin className="w-4 h-4" />
              Pinned
            </button>
            <button
              onClick={() => setFilterType("favorites")}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filterType === "favorites"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Star className="w-4 h-4" />
              Favorites
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 py-2">Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadNotes} />
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            title="No notes found"
            message="Try adjusting your search or filters, or create a new note"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-600/5 transition-all group"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Pin className={`w-4 h-4 ${note.isPinned ? 'text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(note.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${note.isFavorite ? 'text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
                      <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>

              {/* Note Title */}
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                {note.title}
              </h3>

              {/* Note Content */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {note.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Linked To */}
              {note.linkedTo && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>Linked to: <span className="font-medium text-gray-900 dark:text-white">{note.linkedTo}</span></span>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{note.createdAt}</span>
                </div>
                {note.updatedAt !== note.createdAt && (
                  <span>Updated {note.updatedAt}</span>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Templates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create notes from pre-built templates
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <Tag className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Manage Tags
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organize and customize your tags
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <Users className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Link Notes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect notes to investors and meetings
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
