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
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent">
              Manage Fundraising
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Track investors, measure outreach performance, and close deals with clarity and structure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-800/50
                hover:border-red-500/50 dark:hover:border-red-500/50
                hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20
                transition-all duration-500 hover:-translate-y-1"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl
                  bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900
                  group-hover:from-red-600 group-hover:to-red-500 dark:group-hover:from-red-600 dark:group-hover:to-red-500
                  shadow-lg group-hover:shadow-red-500/50
                  transition-all duration-500 group-hover:scale-110">
                  <Icon className="w-7 h-7 text-gray-700 dark:text-gray-300
                    group-hover:text-white transition-colors duration-500" />
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 dark:text-gray-400 leading-relaxed">
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
