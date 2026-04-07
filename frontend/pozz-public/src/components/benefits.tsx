import { Target, TrendingUp, Users, Zap } from "lucide-react"

const benefits = [
  {
    icon: Target,
    title: "Know What Works",
    description: "Stop wasting time on platforms that don't deliver. Track which sources generate real leads and deals.",
    stat: "100% Attribution"
  },
  {
    icon: TrendingUp,
    title: "Never Lose Track",
    description: "Every investor interaction, meeting note, and status change in one timeline. Complete visibility.",
    stat: "Full History"
  },
  {
    icon: Users,
    title: "Move Faster",
    description: "Clear pipeline stages and organized data mean you spend less time managing and more time closing.",
    stat: "Save Hours Weekly"
  },
  {
    icon: Zap,
    title: "Make Data-Driven Decisions",
    description: "Real analytics on conversion rates, platform performance, and investor engagement patterns.",
    stat: "Actionable Insights"
  }
]

export function Benefits() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0, 104, 139) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#00688b]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#00688b]/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#00688b] dark:text-[#0088b3] bg-[#e6f4f8] dark:bg-[#00344a]/30 px-4 py-2 rounded-full">
              Benefits
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Why Startups Choose{" "}
            <span className="bg-gradient-to-r from-[#00688b] to-[#0088b3] dark:from-[#0088b3] dark:to-[#00a8d8] bg-clip-text text-transparent">
              Pozz.io
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Built for founders who need clarity, not complexity
          </p>
        </div>

        {/* Two Column Layout: Image + Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Video */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-[#00688b]/10 to-[#0088b3]/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              >
                <source src="/benefits-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right: Benefits List */}
          <div className="space-y-6 order-1 lg:order-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="relative group p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                  border border-gray-200/50 dark:border-gray-800/50
                  hover:border-[#00688b]/50 dark:hover:border-[#00688b]/50
                  hover:shadow-xl hover:shadow-[#00688b]/10 dark:hover:shadow-[#00688b]/20
                  transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00688b]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00688b] to-[#005570]
                        flex items-center justify-center group-hover:scale-110 group-hover:rotate-3
                        shadow-lg group-hover:shadow-[#00688b]/50 transition-all duration-500">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {benefit.title}
                        </h3>
                        <span className="text-xs font-semibold text-[#00688b] dark:text-[#0088b3]
                          bg-[#e6f4f8] dark:bg-[#00344a]/30 px-3 py-1 rounded-full shadow-sm">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
