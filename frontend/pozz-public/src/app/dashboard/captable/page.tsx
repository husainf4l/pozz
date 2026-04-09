"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { capTableService } from "@/lib/services/captable"
import { 
  Plus, 
  PieChart, 
  DollarSign, 
  TrendingUp,
  Users,
  Calculator,
  Download
} from "lucide-react"
import type { CapTable, Shareholder } from "@/lib/types/api"

export default function CapTablePage() {
  const [capTable, setCapTable] = useState<CapTable | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projectId] = useState("default-project") // In real app, from router

  const loadCapTable = async () => {
    try {
      setIsLoading(true)
      const data = await capTableService.get(projectId)
      setCapTable(data)
    } catch (err) {
      console.error("Failed to load cap table:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCapTable()
  }, [])

  const calculateOwnership = (shares: number) => {
    if (!capTable) return 0
    return (shares / capTable.fullyDilutedShares) * 100
  }

  const getTypeColor = (type: Shareholder['type']) => {
    switch (type) {
      case 'founder':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'investor':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'employee':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'advisor':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingCard />
      </DashboardLayout>
    )
  }

  if (!capTable) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <PieChart className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No cap table found
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Cap Table
          </Button>
        </div>
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
              Cap Table
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Equity ownership and funding rounds
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Simulate Round
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Shareholder
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Post-Money Valuation</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(capTable.postMoney / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Shareholders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {capTable.shareholders.length}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Shares</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {capTable.totalShares.toLocaleString()}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-orange-600 dark:text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Funding Rounds</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {capTable.rounds.length}
            </p>
          </div>
        </div>

        {/* Shareholders Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shareholders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Shares</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ownership %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Invested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {capTable.shareholders.map((shareholder) => (
                  <tr key={shareholder.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {shareholder.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {shareholder.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(shareholder.type)}`}>
                        {shareholder.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                      {shareholder.shares.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      {calculateOwnership(shareholder.shares).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                      {shareholder.investedAmount 
                        ? `$${(shareholder.investedAmount / 1000).toFixed(0)}K`
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Funding Rounds */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Funding Rounds
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {capTable.rounds.map((round) => (
                <div key={round.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {round.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Amount: ${(round.amount / 1000000).toFixed(1)}M</span>
                        <span>Valuation: ${(round.valuation / 1000000).toFixed(1)}M</span>
                        <span>Share Price: ${round.sharePrice.toFixed(2)}</span>
                        <span>{new Date(round.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor('investor')}`}>
                      {round.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
