"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X, Users, FolderKanban, Calendar, FileText, TrendingDown } from "lucide-react"
import { searchService } from "@/lib/services/search"
import type { SearchResults } from "@/lib/services/search"

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true)
        try {
          const data = await searchService.global(query, { limit: 5 })
          setResults(data)
          setIsOpen(true)
        } catch (err) {
          console.error("Search failed:", err)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults(null)
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleClear = () => {
    setQuery('')
    setResults(null)
    setIsOpen(false)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    setResults(null)
  }

  const totalResults = results ? results.total : 0

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results) setIsOpen(true)
          }}
          placeholder="Search investors, projects, meetings... (⌘K)"
          className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-600"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 max-h-[500px] overflow-y-auto">
          {totalResults === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          ) : (
            <div className="p-2">
              {/* Investors */}
              {results.investors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <Users className="w-4 h-4" />
                    Investors ({results.investors.length})
                  </div>
                  <div className="space-y-1">
                    {results.investors.map((investor) => (
                      <Link
                        key={investor.id}
                        href={`/dashboard/investors`}
                        onClick={handleResultClick}
                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investor.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {investor.company} • {investor.status}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <FolderKanban className="w-4 h-4" />
                    Projects ({results.projects.length})
                  </div>
                  <div className="space-y-1">
                    {results.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects`}
                        onClick={handleResultClick}
                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {project.status}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Meetings */}
              {results.meetings.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <Calendar className="w-4 h-4" />
                    Meetings ({results.meetings.length})
                  </div>
                  <div className="space-y-1">
                    {results.meetings.map((meeting) => (
                      <Link
                        key={meeting.id}
                        href={`/dashboard/meetings`}
                        onClick={handleResultClick}
                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {meeting.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <FileText className="w-4 h-4" />
                    Notes ({results.notes.length})
                  </div>
                  <div className="space-y-1">
                    {results.notes.map((note) => (
                      <Link
                        key={note.id}
                        href={`/dashboard/notes`}
                        onClick={handleResultClick}
                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {note.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {note.content}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Results */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`)
                    handleResultClick()
                  }}
                  className="w-full px-3 py-2 text-sm text-center text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium"
                >
                  View all {totalResults} results →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
