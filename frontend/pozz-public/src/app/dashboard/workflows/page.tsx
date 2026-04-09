"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { workflowsService } from "@/lib/services/workflows"
import { 
  Plus, 
  Zap, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  CheckCircle,
  Mail,
  Bell,
  UserPlus
} from "lucide-react"
import type { Workflow } from "@/lib/types/api"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadWorkflows = async () => {
    try {
      setIsLoading(true)
      const data = await workflowsService.getAll()
      setWorkflows(data)
    } catch (err) {
      console.error("Failed to load workflows:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const handleToggle = async (id: string) => {
    try {
      await workflowsService.toggle(id)
      await loadWorkflows()
    } catch (err: any) {
      alert(err.message || "Failed to toggle workflow")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this workflow?")) return
    try {
      await workflowsService.delete(id)
      await loadWorkflows()
    } catch (err: any) {
      alert(err.message || "Failed to delete workflow")
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'deal_stage_change':
        return <Zap className="w-5 h-5 text-purple-600 dark:text-purple-500" />
      case 'investor_added':
        return <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-500" />
      case 'meeting_scheduled':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
      default:
        return <Zap className="w-5 h-5 text-gray-600 dark:text-gray-500" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email':
        return <Mail className="w-4 h-4" />
      case 'send_notification':
        return <Bell className="w-4 h-4" />
      case 'create_task':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
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
              Workflows
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Automate repetitive tasks • {workflows.filter(w => w.isActive).length} active
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {workflows.length}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
              {workflows.filter(w => w.isActive).length}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Paused</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
              {workflows.filter(w => !w.isActive).length}
            </p>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <Zap className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No workflows yet
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Automate your fundraising process with workflows
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
              </Button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      workflow.isActive 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {getTriggerIcon(workflow.trigger.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {workflow.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          workflow.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {workflow.isActive ? 'Active' : 'Paused'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Created {new Date(workflow.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(workflow.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title={workflow.isActive ? 'Pause' : 'Activate'}
                    >
                      {workflow.isActive ? (
                        <Pause className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Play className="w-5 h-5 text-green-600 dark:text-green-500" />
                      )}
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Workflow Flow */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      When: {workflow.trigger.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex flex-wrap gap-2">
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                        {getActionIcon(action.type)}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {action.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
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
