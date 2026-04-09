"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Download, Filter, Save, BarChart3, LineChart as LineChartIcon, PieChart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const dataFields = [
  { id: "investors", label: "Total Investors", category: "Investors" },
  { id: "deals", label: "Active Deals", category: "Pipeline" },
  { id: "raised", label: "Amount Raised", category: "Financial" },
  { id: "meetings", label: "Meetings Count", category: "Activity" },
  { id: "conversion", label: "Conversion Rate", category: "Pipeline" },
  { id: "avgDeal", label: "Average Deal Size", category: "Financial" },
  { id: "sources", label: "Top Sources", category: "Distribution" },
  { id: "locations", label: "Geographic Data", category: "Investors" },
]

const timeRanges = ["Last 7 days", "Last 30 days", "Last 3 months", "Last 6 months", "Last year", "All time"]
const chartTypes = [
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "line", label: "Line Chart", icon: LineChartIcon },
  { id: "pie", label: "Pie Chart", icon: PieChart },
  { id: "trend", label: "Trend Line", icon: TrendingUp },
]

const savedReports = [
  {
    id: 1,
    name: "Monthly Investor Growth",
    fields: ["investors", "sources"],
    chartType: "line",
    timeRange: "Last 6 months",
    lastRun: "2 hours ago",
  },
  {
    id: 2,
    name: "Pipeline Performance",
    fields: ["deals", "conversion"],
    chartType: "bar",
    timeRange: "Last 3 months",
    lastRun: "1 day ago",
  },
  {
    id: 3,
    name: "Financial Overview",
    fields: ["raised", "avgDeal"],
    chartType: "trend",
    timeRange: "Last year",
    lastRun: "3 days ago",
  },
]

export default function CustomReportBuilderPage() {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedChartType, setSelectedChartType] = useState("bar")
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 days")

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Custom Report Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create custom reports with your preferred metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Report
            </Button>
            <Button className="shadow-lg shadow-red-600/20">
              <Download className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Fields Selection */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Select Data Fields
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataFields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => toggleField(field.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedFields.includes(field.id)
                      ? "border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {field.label}
                    </span>
                    {selectedFields.includes(field.id) && (
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                    {field.category}
                  </span>
                </button>
              ))}
            </div>

            {/* Time Range */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                Time Range
              </h3>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTimeRange === range
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                Chart Type
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {chartTypes.map((chart) => {
                  const Icon = chart.icon
                  return (
                    <button
                      key={chart.id}
                      onClick={() => setSelectedChartType(chart.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedChartType === chart.id
                          ? "border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedChartType === chart.id
                          ? "text-red-600 dark:text-red-500"
                          : "text-gray-400"
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {chart.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Report Preview
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Selected Fields
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedFields.length || "0"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Time Range
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedTimeRange}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Chart Type
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {selectedChartType}
                </div>
              </div>

              {selectedFields.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Fields to Include:
                  </div>
                  <div className="space-y-2">
                    {selectedFields.map((fieldId) => {
                      const field = dataFields.find(f => f.id === fieldId)
                      return (
                        <div
                          key={fieldId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-900 dark:text-white">
                            {field?.label}
                          </span>
                          <button
                            onClick={() => toggleField(fieldId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button className="w-full" disabled={selectedFields.length === 0}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Preview Report
              </Button>
            </div>
          </div>
        </div>

        {/* Saved Reports */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Saved Reports
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {report.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    {report.fields.length} fields
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    {report.chartType}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last run: {report.lastRun}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Load Template
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Export Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-gray-900 dark:text-white">Include Charts</span>
            </label>
            <label className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-gray-900 dark:text-white">Include Data Table</span>
            </label>
            <label className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-900 dark:text-white">Include Insights</span>
            </label>
            <label className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-900 dark:text-white">Schedule Email</span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
