"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, Filter, Mail, Phone, MapPin, ExternalLink, Edit, Trash2, Users, Upload, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { investorsService } from "@/lib/services/investors"
import { LoadingTable } from "@/components/loading-states"
import { ErrorMessage, EmptyState } from "@/components/error-states"
import type { Investor } from "@/lib/types/api"

const statuses = ["All", "Lead", "Contacted", "Meeting", "Negotiation", "Closed"]
const sources = ["All", "AngelList", "LinkedIn", "Twitter", "Email", "Referral", "Other"]

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterSource, setFilterSource] = useState("All")
  const [investors, setInvestors] = useState<Investor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortedInvestors = () => {
    if (!sortField) return investors

    return [...investors].sort((a, b) => {
      let aVal: any = a[sortField as keyof Investor]
      let bVal: any = b[sortField as keyof Investor]

      // Handle null/undefined values
      if (aVal == null) aVal = ""
      if (bVal == null) bVal = ""

      // Convert to strings for comparison
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })
  }

  const sortedInvestors = getSortedInvestors()

  const handleSelectAll = () => {
    if (selectedIds.length === investors.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(investors.map(i => i.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} investor(s)?`)) return
    
    try {
      await Promise.all(selectedIds.map(id => investorsService.delete(id)))
      setSelectedIds([])
      await loadInvestors()
    } catch (err: any) {
      alert(err.message || "Failed to delete investors")
    }
  }

  const handleBulkExport = () => {
    const selectedInvestors = investors.filter(i => selectedIds.includes(i.id))
    const csv = [
      ["Name", "Email", "Company", "Status", "Source", "Investment Range"],
      ...selectedInvestors.map(i => [
        i.name,
        i.email,
        i.company || "",
        i.status,
        i.source || "",
        i.investmentRange || ""
      ])
    ].map(row => row.join(",")).join("\\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `investors-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportAll = () => {
    const csv = [
      ["Name", "Email", "Company", "Role", "Status", "Source", "Investment Range", "Phone", "Location"],
      ...investors.map(i => [
        i.name,
        i.email,
        i.company || "",
        i.role || "",
        i.status,
        i.source || "",
        i.investmentRange || "",
        i.phone || "",
        i.location || ""
      ])
    ].map(row => row.join(",")).join("\\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `all-investors-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const lines = text.split("\\n")
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
      
      let successCount = 0
      let errorCount = 0
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(",")
        const investorData: any = {}
        
        headers.forEach((header, idx) => {
          const value = values[idx]?.trim()
          if (header === "name") investorData.name = value
          else if (header === "email") investorData.email = value
          else if (header === "company") investorData.company = value
          else if (header === "role") investorData.role = value
          else if (header === "status") investorData.status = value
          else if (header === "source") investorData.source = value
          else if (header === "investment range") investorData.investmentRange = value
          else if (header === "phone") investorData.phone = value
          else if (header === "location") investorData.location = value
        })
        
        if (investorData.name && investorData.email) {
          try {
            await investorsService.create(investorData)
            successCount++
          } catch (err) {
            errorCount++
            console.error(`Failed to import investor ${investorData.name}:`, err)
          }
        }
      }
      
      await loadInvestors()
      alert(`Import complete! ${successCount} investors added, ${errorCount} failed.`)
    } catch (err: any) {
      alert(err.message || "Failed to import file")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const loadInvestors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await investorsService.getAll({
        page: 1,
        pageSize: 50,
        status: filterStatus !== "All" ? filterStatus : undefined,
        source: filterSource !== "All" ? filterSource : undefined,
        search: searchQuery || undefined,
      })
      setInvestors(response.data)
    } catch (err: any) {
      console.error("Failed to load investors:", err)
      setError(err.message || "Failed to load investors")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvestors()
  }, [filterStatus, filterSource])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2 || searchQuery.length === 0) {
        loadInvestors()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investor?")) return
    
    try {
      await investorsService.delete(id)
      await loadInvestors()
    } catch (err: any) {
      alert(err.message || "Failed to delete investor")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Investors
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your investor database and relationships
            </p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? "Importing..." : "Import CSV"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportAll}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button className="shadow-lg shadow-red-600/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Investor
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investors by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === "All" ? "All Sources" : source}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        {selectedIds.length > 0 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedIds.length} investor(s) selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
              >
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {investors.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Investors
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {investors.filter(i => i.status === "Meeting").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              In Meetings
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {investors.filter(i => i.status === "Negotiation").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Negotiating
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {investors.filter(i => i.status === "Lead").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              New Leads
            </div>
          </div>
        </div>

        {/* Investors Table */}
        {isLoading ? (
          <LoadingTable rows={5} cols={7} />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadInvestors} />
        ) : investors.length === 0 ? (
          <EmptyState
            title="No investors found"
            message={searchQuery || filterStatus !== "All" || filterSource !== "All" 
              ? "Try adjusting your search or filters" 
              : "Get started by adding your first investor"}
            action={{ 
              label: "Add Investor", 
              onClick: () => alert("Add investor modal would open here") 
            }}
          />
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === investors.length && investors.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Investor
                        {sortField === "name" ? (
                          sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Contact
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Status
                        {sortField === "status" ? (
                          sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Investment Range
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => handleSort("source")}
                        className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Source
                        {sortField === "source" ? (
                          sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Last Contact
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvestors.map((investor) => (
                    <tr
                      key={investor.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                    >
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(investor.id)}
                          onChange={() => handleSelectOne(investor.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium shrink-0">
                            {investor.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {investor.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {investor.role} at {investor.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-3 h-3" />
                            {investor.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-3 h-3" />
                            {investor.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          investor.status === "Meeting"
                            ? "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500"
                            : investor.status === "Negotiation"
                            ? "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-500"
                            : investor.status === "Contacted"
                            ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500"
                            : "bg-gray-600/10 dark:bg-gray-600/20 text-gray-600 dark:text-gray-500"
                        }`}>
                          {investor.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investor.investmentRange}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {investor.sectors?.join(", ")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {investor.source}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {investor.lastContact || "Never"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button 
                            onClick={() => handleDelete(investor.id)}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center transition-all group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <Users className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Import Investors
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload CSV or connect to external sources
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <Filter className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Advanced Filters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create custom filters and saved views
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <ExternalLink className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Export Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download investor list as CSV or PDF
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
