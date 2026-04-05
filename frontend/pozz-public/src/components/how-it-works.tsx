import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Share Your Project",
    description: "Post your project on platforms, listings, and outreach channels. Track every URL where you share.",
    color: "from-red-600 to-red-700"
  },
  {
    number: "02",
    title: "Capture Investors",
    description: "Add incoming investors and link them to the exact source where they discovered your project.",
    color: "from-gray-900 to-black"
  },
  {
    number: "03",
    title: "Track Progress",
    description: "Move investors through your pipeline: Lead → Contacted → Meeting → Negotiation → Closed.",
    color: "from-red-600 to-red-700"
  },
  {
    number: "04",
    title: "Measure & Optimize",
    description: "See which platforms generate the most leads, meetings, and deals. Focus on what works.",
    color: "from-gray-900 to-black"
  }
]

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full">
              Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent">
              Pozz.io
            </span>
            {" "}Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A simple, structured approach to managing your entire fundraising process
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector Arrow - hidden on last item */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-4 z-10">
                  <ArrowRight className="w-8 h-8 text-red-500/50 dark:text-red-500/50 group-hover:text-red-500 dark:group-hover:text-red-500 transition-colors" />
                </div>
              )}

              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl
                bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-800/50
                hover:border-red-500/50 dark:hover:border-red-500/50
                hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20
                transition-all duration-500 hover:-translate-y-2">
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Number Badge */}
                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl
                  bg-gradient-to-br ${step.color} text-white font-bold text-2xl mb-6
                  shadow-lg group-hover:shadow-red-500/50 group-hover:scale-110 transition-all duration-500`}>
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="relative text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to organize your fundraising?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md 
              bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
