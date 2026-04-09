"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Calendar, Clock, Video, MapPin, Users, CheckCircle, XCircle, AlertCircle, FileText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { meetingsService } from "@/lib/services/meetings"
import { LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage, EmptyState } from "@/components/error-states"
import type { Meeting } from "@/lib/types/api"

const mockMeetings = [
  {
    id: 1,
    title: "Pitch Presentation - Acme Ventures",
    investor: "John Smith",
    company: "Acme Ventures",
    date: "Today",
    time: "2:00 PM",
    duration: "60 min",
    type: "Video Call",
    status: "Scheduled",
    location: "Zoom",
    outcome: null,
    notes: "Prepare updated financial projections",
    avatar: "JS",
  },
  {
    id: 2,
    title: "Follow-up Meeting - Tech Capital",
    investor: "Sarah Johnson",
    company: "Tech Capital",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: "45 min",
    type: "In Person",
    status: "Scheduled",
    location: "Their Office, NYC",
    outcome: null,
    notes: "Discuss term sheet details",
    avatar: "SJ",
  },
  {
    id: 3,
    title: "Initial Call - Future Fund",
    investor: "Mike Wilson",
    company: "Future Fund",
    date: "Jan 10, 2024",
    time: "3:00 PM",
    duration: "30 min",
    type: "Phone Call",
    status: "Completed",
    location: "Phone",
    outcome: "Positive",
    notes: "Showed strong interest in our traction metrics",
    avatar: "MW",
  },
  {
    id: 4,
    title: "Due Diligence Review - Growth Partners",
    investor: "Emily Davis",
    company: "Growth Partners",
    date: "Jan 8, 2024",
    time: "1:00 PM",
    duration: "90 min",
    type: "Video Call",
    status: "Completed",
    location: "Google Meet",
    outcome: "Positive",
    notes: "Requested cap table and customer references",
    avatar: "ED",
  },
  {
    id: 5,
    title: "Coffee Chat - Seed Investors",
    investor: "David Lee",
    company: "Seed Investors",
    date: "Jan 5, 2024",
    time: "11:00 AM",
    duration: "45 min",
    type: "In Person",
    status: "Completed",
    location: "Blue Bottle Coffee",
    outcome: "Neutral",
    notes: "Wants to see more market validation",
    avatar: "DL",
  },
  {
    id: 6,
    title: "Demo Session - Innovation Capital",
    investor: "Lisa Chen",
    company: "Innovation Capital",
    date: "Jan 3, 2024",
    time: "4:00 PM",
    duration: "60 min",
    type: "Video Call",
    status: "Cancelled",
    location: "Zoom",
    outcome: null,
    notes: "Rescheduled to next week",
    avatar: "LC",
  },
]

export default function MeetingsPage() {
  const [view, setView] = useState<"upcoming" | "past">("upcoming")
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMeetings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = view === "upcoming" 
        ? await meetingsService.getUpcoming()
        : await meetingsService.getPast()
      setMeetings(data)
    } catch (err: any) {
      console.error("Failed to load meetings:", err)
      setError(err.message || "Failed to load meetings")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMeetings()
  }, [view])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return
    
    try {
      await meetingsService.delete(id)
      await loadMeetings()
    } catch (err: any) {
      alert(err.message || "Failed to delete meeting")
    }
  }

  const upcomingMeetings = meetings.filter(m => m.status === "Scheduled")
  const pastMeetings = meetings.filter(m => m.status === "Completed" || m.status === "Cancelled")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meetings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage your investor meetings
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {upcomingMeetings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Upcoming
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {pastMeetings.filter(m => m.outcome === "Positive").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Positive Outcomes
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
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              8.5h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Hours
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setView("upcoming")}
            className={`px-4 py-2 font-medium transition-all ${
              view === "upcoming"
                ? "text-red-600 dark:text-red-500 border-b-2 border-red-600 dark:border-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Upcoming ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setView("past")}
            className={`px-4 py-2 font-medium transition-all ${
              view === "past"
                ? "text-red-600 dark:text-red-500 border-b-2 border-red-600 dark:border-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Past ({pastMeetings.length})
          </button>
        </div>

        {/* Meetings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadMeetings} />
        ) : meetings.length === 0 ? (
          <EmptyState
            title="No meetings found"
            message={view === "upcoming" ? "No upcoming meetings scheduled" : "No past meetings"}
            action={{ label: "Schedule Meeting", onClick: () => alert("Schedule meeting modal") }}
          />
        ) : (
          <div className="space-y-4">
            {(view === "upcoming" ? upcomingMeetings : pastMeetings).map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-600/5 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium shrink-0">
                    {meeting.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{meeting.investor} - {meeting.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{meeting.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                    </div>

                    {/* Meeting Type & Location */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {meeting.type === "Video Call" && <Video className="w-3 h-3" />}
                        {meeting.type === "In Person" && <MapPin className="w-3 h-3" />}
                        {meeting.type === "Phone Call" && <Users className="w-3 h-3" />}
                        {meeting.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {meeting.location}
                      </span>
                      {meeting.outcome && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          meeting.outcome === "Positive"
                            ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500"
                            : meeting.outcome === "Neutral"
                            ? "bg-yellow-600/10 dark:bg-yellow-600/20 text-yellow-600 dark:text-yellow-500"
                            : "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500"
                        }`}>
                          {meeting.outcome === "Positive" && <CheckCircle className="w-3 h-3" />}
                          {meeting.outcome === "Neutral" && <AlertCircle className="w-3 h-3" />}
                          {meeting.outcome === "Negative" && <XCircle className="w-3 h-3" />}
                          {meeting.outcome}
                        </span>
                      )}
                      {meeting.status === "Cancelled" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500">
                          <XCircle className="w-3 h-3" />
                          Cancelled
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {meeting.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {meeting.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-all">
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Edit</span>
                  </button>
                  {meeting.status === "Scheduled" && (
                    <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-all">
                      <Video className="w-4 h-4" />
                      <span className="text-sm font-medium">Join</span>
                    </button>
                  )}
                  {meeting.status === "Completed" && (
                    <button className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-all">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Calendar Integration Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-4">
            Calendar Integration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <Calendar className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Google Calendar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sync your meetings with Google Calendar
              </p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <Calendar className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Outlook Calendar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with Microsoft Outlook
              </p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
              <Calendar className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Apple Calendar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Integrate with Apple Calendar
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
