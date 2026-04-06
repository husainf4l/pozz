const stats = [
  {
    value: "100%",
    label: "Source Attribution",
    description: "Know exactly where every investor came from"
  },
  {
    value: "5 Stages",
    label: "Clear Pipeline",
    description: "Lead to closing with complete visibility"
  },
  {
    value: "All-in-One",
    label: "Unified Platform",
    description: "Investors, meetings, deals, and notes"
  },
  {
    value: "Real-Time",
    label: "Analytics",
    description: "Track performance by source and platform"
  }
]

export function Stats() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dark Background with Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 dark:from-gray-950 dark:via-black dark:to-gray-950" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00688b]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#00688b]/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 104, 139, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 104, 139, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative text-center group"
            >
              {/* Card Container */}
              <div className="p-8 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-sm
                border border-white/10 dark:border-white/10
                hover:border-[#00688b]/50 dark:hover:border-[#00688b]/50
                hover:bg-white/10 dark:hover:bg-white/10
                transition-all duration-500 hover:scale-105">
                
                <div className="mb-4">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#0088b3] to-[#00688b] bg-clip-text text-transparent mb-3
                    group-hover:scale-110 transition-transform duration-500">
                    {stat.value}
                  </div>
                  <div className="text-xl font-bold text-white dark:text-white mb-2">
                    {stat.label}
                  </div>
                </div>
                <p className="text-gray-400 dark:text-gray-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
