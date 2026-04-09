"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Download, FileText, Calendar, TrendingUp, Users, DollarSign, Target, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const reportTemplates = [
  {
    id: 1,
    name: "Investor Summary Report",
    description: "Complete overview of all investors and their status",
    icon: Users,
    category: "Investors",
    lastGenerated: "2 days ago",
    popular: true,
  },
  {
    id: 2,
    name: "Pipeline Performance",
    description: "Deal flow analysis and conversion metrics",
    icon: TrendingUp,
    category: "Pipeline",
    lastGenerated: "5 days ago",
    popular: true,
  },
  {
    id: 3,
    name: "Financial Overview",
    description: "Fundraising progress and financial projections",
    icon: DollarSign,
    category: "Financial",
    lastGenerated: "1 week ago",
    popular: false,
  },
  {
    id: 4,
    name: "Meeting Activity Report",
    description: "All meetings, outcomes, and follow-ups",
    icon: Calendar,
    category: "Meetings",
    lastGenerated: "3 days ago",
    popular: false,
  },
  {
    id: 5,
    name: "Monthly Progress Report",
    description: "Month-over-month fundraising progress",
    icon: Target,
    category: "Progress",
    lastGenerated: "1 day ago",
    popular: true,
  },
  {
    id: 6,
    name: "Source Attribution",
    description: "Which platforms drive the most investors",
    icon: TrendingUp,
    category: "Distribution",
    lastGenerated: "4 days ago",
    popular: false,
  },
]

const recentReports = [
  {
    id: 1,
    name: "Q2 Investor Summary",
    type: "PDF",
    size: "2.4 MB",
    generatedAt: "2 hours ago",
    status: "Ready",
  },
  {
    id: 2,
    name: "Pipeline Analysis - June",
    type: "Excel",
    size: "1.8 MB",
    generatedAt: "1 day ago",
    status: "Ready",
  },
  {
    id: 3,
    name: "Monthly Progress - May",
    type: "PDF",
    size: "3.1 MB",
    generatedAt: "3 days ago",
    status: "Ready",
  },
  {
    id: 4,
    name: "Investor Database Export",
    type: "CSV",
    size: "456 KB",
    generatedAt: "5 days ago",
    status: "Ready",
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Pipeline Update",
    frequency: "Every Monday at 9:00 AM",
    recipients: "team@pozz.io",
    status: "Active",
  },
  {
    id: 2,
    name: "Monthly Investor Report",
    frequency: "1st of every month",
    recipients: "investors@pozz.io",
    status: "Active",
  },
  {
    id: 3,
    name: "Quarterly Board Report",
    frequency: "Every 3 months",
    recipients: "board@pozz.io",
    status: "Active",
  },
]

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", "Investors", "Pipeline", "Financial", "Meetings", "Progress", "Distribution"]

  const filteredTemplates = selectedCategory === "All"
    ? reportTemplates
    : reportTemplates.filter(t => t.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Generate and download comprehensive reports
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <FileText className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reportTemplates.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Templates
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {recentReports.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Recent Reports
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {scheduledReports.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Scheduled
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              24
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              This Month
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Report Templates */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Report Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-600/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    {template.popular && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                      {template.category}
                    </span>
                    <span>Last: {template.lastGenerated}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Reports
            </h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {report.type} • {report.size} • {report.generatedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500">
                      <CheckCircle className="w-3 h-3" />
                      {report.status}
                    </span>
                    <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Scheduled Reports
              </h2>
              <Button variant="outline" size="sm">
                + Add Schedule
              </Button>
            </div>
            <div className="space-y-3">
              {scheduledReports.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-600 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {schedule.name}
                    </div>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500">
                      {schedule.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Clock className="w-3 h-3" />
                    {schedule.frequency}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    To: {schedule.recipients}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Export Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all text-center">
              <FileText className="w-8 h-8 text-red-600 dark:text-red-500 mx-auto mb-3" />
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                PDF Report
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Professional format
              </div>
            </button>

            <button className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all text-center">
              <FileText className="w-8 h-8 text-green-600 dark:text-green-500 mx-auto mb-3" />
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                Excel Export
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Editable spreadsheet
              </div>
            </button>

            <button className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all text-center">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-500 mx-auto mb-3" />
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                CSV Data
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Raw data export
              </div>
            </button>

            <button className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all text-center">
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-500 mx-auto mb-3" />
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                PowerPoint
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Presentation slides
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
