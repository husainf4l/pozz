"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Mail, Phone, Building2, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { pipelineService } from "@/lib/services/projects"
import { LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage } from "@/components/error-states"
import type { PipelineDeal } from "@/lib/types/api"

const stages = [
  { id: "lead", name: "Lead", color: "gray", count: 8 },
  { id: "contacted", name: "Contacted", color: "blue", count: 5 },
  { id: "meeting", name: "Meeting", color: "purple", count: 4 },
  { id: "negotiation", name: "Negotiation", color: "orange", count: 2 },
  { id: "closed", name: "Closed", color: "green", count: 3 },
]

const deals = {
  lead: [
    {
      id: 1,
      investor: "John Doe",
      company: "Venture Capital Inc",
      amount: "$500K",
      source: "AngelList",
      addedDate: "Jan 15, 2024",
      avatar: "JD",
    },
    {
      id: 2,
      investor: "Jane Smith",
      company: "Tech Investors",
      amount: "$750K",
      source: "LinkedIn",
      addedDate: "Jan 14, 2024",
      avatar: "JS",
    },
    {
      id: 3,
      investor: "Bob Wilson",
      company: "Growth Partners",
      amount: "$1M",
      source: "Referral",
      addedDate: "Jan 13, 2024",
      avatar: "BW",
    },
  ],
  contacted: [
    {
      id: 4,
      investor: "Sarah Johnson",
      company: "Tech Capital",
      amount: "$2M",
      source: "Email",
      addedDate: "Jan 12, 2024",
      avatar: "SJ",
    },
    {
      id: 5,
      investor: "Mike Brown",
      company: "Innovation Fund",
      amount: "$500K",
      source: "Twitter",
      addedDate: "Jan 11, 2024",
      avatar: "MB",
    },
  ],
  meeting: [
    {
      id: 6,
      investor: "Emily Davis",
      company: "Future Ventures",
      amount: "$1.5M",
      source: "AngelList",
      addedDate: "Jan 10, 2024",
      avatar: "ED",
    },
    {
      id: 7,
      investor: "David Lee",
      company: "Seed Capital",
      amount: "$800K",
      source: "LinkedIn",
      addedDate: "Jan 9, 2024",
      avatar: "DL",
    },
  ],
  negotiation: [
    {
      id: 8,
      investor: "Lisa Chen",
      company: "Growth Fund",
      amount: "$3M",
      source: "Referral",
      addedDate: "Jan 8, 2024",
      avatar: "LC",
    },
  ],
  closed: [
    {
      id: 9,
      investor: "Tom Anderson",
      company: "Capital Partners",
      amount: "$2.5M",
      source: "Email",
      addedDate: "Jan 7, 2024",
      avatar: "TA",
    },
  ],
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Record<string, PipelineDeal[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedDeal, setDraggedDeal] = useState<PipelineDeal | null>(null)

  const loadDeals = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await pipelineService.getAll()
      setDeals(data)
    } catch (err: any) {
      console.error("Failed to load pipeline:", err)
      setError(err.message || "Failed to load pipeline")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const handleDragStart = (deal: PipelineDeal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (toStage: string) => {
    if (!draggedDeal) return

    try {
      await pipelineService.moveDeal(draggedDeal.id, toStage)
      await loadDeals()
    } catch (err: any) {
      alert(err.message || "Failed to move deal")
    } finally {
      setDraggedDeal(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return
    
    try {
      await pipelineService.delete(id)
      await loadDeals()
    } catch (err: any) {
      alert(err.message || "Failed to delete deal")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Pipeline
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your fundraising deals through each stage
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stage.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stage.name}
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadDeals} />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="inline-flex gap-4 pb-4 min-w-full">
              {stages.map((stage) => {
                const stageDeals = deals[stage.id as keyof typeof deals] || []
                
                return (
                  <div
                    key={stage.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(stage.id)}
                    className="flex-1 min-w-[300px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4"
                  >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {stage.name}
                      </h3>
                      <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                        {stageDeals.length}
                      </span>
                    </div>
                    <button className="w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center transition-all">
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:shadow-red-600/5 transition-all cursor-move"
                      >
                        {/* Card Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium text-sm shrink-0">
                            {deal.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {deal.investor}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {deal.company}
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="w-4 h-4 text-red-600 dark:text-red-500" />
                          <span className="font-bold text-red-600 dark:text-red-500">
                            {deal.amount}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3" />
                            <span>{deal.source}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{deal.addedDate}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                          <button className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 transition-all flex items-center justify-center gap-1">
                            <Mail className="w-3 h-3" />
                            Email
                          </button>
                          <button className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 transition-all flex items-center justify-center gap-1">
                            <Phone className="w-3 h-3" />
                            Call
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="p-8 text-center text-gray-400 dark:text-gray-600 text-sm">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        )}

        {/* Pipeline Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Conversion Rates
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Lead → Contacted</span>
                  <span className="font-medium text-gray-900 dark:text-white">62.5%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: "62.5%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Contacted → Meeting</span>
                  <span className="font-medium text-gray-900 dark:text-white">80%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Meeting → Closed</span>
                  <span className="font-medium text-gray-900 dark:text-white">37.5%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: "37.5%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Pipeline Value
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline</span>
                <span className="font-bold text-gray-900 dark:text-white">$12.05M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">In Negotiation</span>
                <span className="font-bold text-red-600 dark:text-red-500">$3M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Closed Won</span>
                <span className="font-bold text-green-600 dark:text-green-500">$2.5M</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Deal Size</span>
                <span className="font-bold text-gray-900 dark:text-white">$1.1M</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">Tom Anderson</span>
                  <span className="text-gray-600 dark:text-gray-400"> moved to </span>
                  <span className="text-green-600 font-medium">Closed</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">Lisa Chen</span>
                  <span className="text-gray-600 dark:text-gray-400"> moved to </span>
                  <span className="text-orange-600 font-medium">Negotiation</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">David Lee</span>
                  <span className="text-gray-600 dark:text-gray-400"> moved to </span>
                  <span className="text-purple-600 font-medium">Meeting</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
