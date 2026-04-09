"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { emailsService } from "@/lib/services/emails"
import { proposalsService } from "@/lib/services/proposals"
import { 
  Plus, 
  Send, 
  FileText, 
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import type { Proposal } from "@/lib/types/api"

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filter, setFilter] = useState<'all' | string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadProposals = async () => {
    try {
      setIsLoading(true)
      const response = await proposalsService.getAll({
        page: 1,
        pageSize: 100,
        status: filter !== 'all' ? filter : undefined,
      })
      setProposals(response.data)
    } catch (err) {
      console.error("Failed to load proposals:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProposals()
  }, [filter])

  const handleSend = async (id: string) => {
    try {
      await proposalsService.send(id)
      await loadProposals()
      alert("Proposal sent successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to send proposal")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this proposal?")) return
    try {
      await proposalsService.delete(id)
      await loadProposals()
    } catch (err: any) {
      alert(err.message || "Failed to delete proposal")
    }
  }

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      case 'sent':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'viewed':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    }
  }

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />
      case 'sent':
        return <Send className="w-4 h-4" />
      case 'viewed':
        return <Eye className="w-4 h-4" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
    }
  }

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'draft').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    totalAmount: proposals.filter(p => p.status === 'accepted').reduce((sum, p) => sum + p.amount, 0),
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Proposals
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Investment proposals and term sheets
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
              {stats.draft}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
              {stats.accepted}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Committed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
              ${(stats.totalAmount / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`pb-3 px-1 border-b-2 font-medium whitespace-nowrap capitalize transition-colors ${
                filter === status
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No proposals yet
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create investment proposals for your investors
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </div>
          ) : (
            proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {proposal.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Investment Amount</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(proposal.amount / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Equity</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {proposal.equity}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Valuation</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(proposal.valuation / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Created</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {proposal.viewedAt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Viewed {new Date(proposal.viewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.status === 'draft' && (
                      <Button onClick={() => handleSend(proposal.id)} size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
