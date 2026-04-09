"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { tasksService } from "@/lib/services/tasks"
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  Trash2,
  Calendar,
  User
} from "lucide-react"
import type { Task } from "@/lib/types/api"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const response = await tasksService.getAll({
        page: 1,
        pageSize: 100,
        status: filter !== 'all' ? filter : undefined,
      })
      setTasks(response.data)
    } catch (err) {
      console.error("Failed to load tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [filter])

  const handleComplete = async (id: string) => {
    try {
      await tasksService.complete(id)
      await loadTasks()
    } catch (err: any) {
      alert(err.message || "Failed to complete task")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return
    try {
      await tasksService.delete(id)
      await loadTasks()
    } catch (err: any) {
      alert(err.message || "Failed to delete task")
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length,
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
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {stats.total} total • {stats.overdue} overdue
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'To Do', value: stats.todo, color: 'text-gray-600 dark:text-gray-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600 dark:text-blue-500' },
            { label: 'Completed', value: stats.completed, color: 'text-green-600 dark:text-green-500' },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-600 dark:text-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
          {[
            { id: 'all' as const, label: 'All Tasks' },
            { id: 'todo' as const, label: 'To Do' },
            { id: 'in_progress' as const, label: 'In Progress' },
            { id: 'completed' as const, label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                filter === tab.id
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all ${
                task.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => task.status !== 'completed' && handleComplete(task.id)}
                  className="mt-0.5"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 dark:text-white ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 text-xs ${
                            isOverdue(task.dueDate) && task.status !== 'completed'
                              ? 'text-red-600 dark:text-red-500'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.relatedTo && (
                          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            {task.relatedTo.type}: {task.relatedTo.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'completed' ? 'Complete some tasks!' : 'Create your first task'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
