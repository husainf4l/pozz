"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, Users, DollarSign, Calendar } from "lucide-react"
import { projectsService } from "@/lib/services/projects"
import type { Project } from "@/lib/types/api"

interface FundraisingProgressProps {
  projectId?: string
}

export function FundraisingProgress({ projectId }: FundraisingProgressProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        if (projectId) {
          const data = await projectsService.getById(projectId)
          setProject(data)
        } else {
          // Load first active project
          const response = await projectsService.getAll({ page: 1, pageSize: 1 })
          if (response.data.length > 0) {
            setProject(response.data[0])
          }
        }
      } catch (err) {
        console.error("Failed to load project:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadProject()
  }, [projectId])

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const raised = parseFloat(project.raisedAmount) || 0
  const goal = parseFloat(project.targetAmount) || 1
  const progress = Math.min((raised / goal) * 100, 100)
  const investorCount = project.investors || 0
  const daysLeft = null // Projects don't have deadline in current API

  return (
    <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-900/50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Fundraising Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {project.name}
            </p>
          </div>
        </div>
        {daysLeft !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {daysLeft} days left
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${raised.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                raised
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              of ${goal.toLocaleString()} goal
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {progress.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              complete
            </p>
          </div>
        </div>
        
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Investors</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {investorCount}
          </p>
        </div>
        
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Avg. Investment</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${investorCount > 0 ? Math.round(raised / investorCount).toLocaleString() : '0'}
          </p>
        </div>
        
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Remaining</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${(goal - raised).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Milestone Indicator */}
      {progress >= 25 && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-700 dark:text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-500">
              {progress >= 100 ? '🎉 Goal reached!' : 
               progress >= 75 ? '🔥 Almost there!' : 
               progress >= 50 ? '💪 Halfway there!' : 
               '✨ Great start!'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
