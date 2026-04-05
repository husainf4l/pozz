import { 
  FolderKanban, 
  Users, 
  Share2, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Handshake, 
  BarChart3, 
  Clock, 
  UsersRound 
} from "lucide-react"

const features = [
  {
    icon: FolderKanban,
    title: "Projects",
    description: "Organize your entire fundraising case with materials, links, and notes in one place."
  },
  {
    icon: Users,
    title: "Investor Management",
    description: "Track every investor from lead to closing with clear status tracking and history."
  },
  {
    icon: Share2,
    title: "Distribution Tracking",
    description: "Know exactly where you shared your project and which sources generate results."
  },
  {
    icon: TrendingUp,
    title: "Pipeline",
    description: "Visualize progress through stages: Lead → Contacted → Meeting → Negotiation → Closed."
  },
  {
    icon: Calendar,
    title: "Meetings",
    description: "Log interactions with investors and track outcomes systematically."
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description: "Structured notes linked to investors, meetings, and deals with tagging support."
  },
  {
    icon: Handshake,
    title: "Deal Tracking",
    description: "Monitor investment amounts, valuations, equity, and negotiation progress."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Measure performance by platform, conversion rates, and source attribution."
  },
  {
    icon: Clock,
    title: "Timeline",
    description: "Complete chronological view of every investor interaction and status change."
  },
  {
    icon: UsersRound,
    title: "Team Collaboration",
    description: "Work together with shared access, assignments, and internal collaboration."
  }
]

export function Features() {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Everything You Need to{" "}
            <span className="text-red-600 dark:text-red-500">Manage Fundraising</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track investors, measure outreach performance, and close deals with clarity and structure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-6 rounded-xl border border-gray-200 dark:border-gray-800 
                hover:border-red-600 dark:hover:border-red-600 transition-all duration-300
                hover:shadow-lg hover:shadow-red-600/10 dark:hover:shadow-red-600/20"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg 
                  bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black
                  group-hover:from-red-600 group-hover:to-red-700 dark:group-hover:from-red-600 dark:group-hover:to-red-700
                  transition-all duration-300">
                  <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 
                    group-hover:text-white transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
