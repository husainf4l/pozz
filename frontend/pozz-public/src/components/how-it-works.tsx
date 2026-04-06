"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Share2, Users, TrendingUp, Target } from "lucide-react"
import { AUTH_CONFIG } from "@/lib/config"

const steps = [
  {
    number: "01",
    icon: Share2,
    title: "Share Your Project",
    description: "Post your project on platforms, listings, and outreach channels. Track every URL where you share.",
    gradient: "from-[#00688b] to-[#005570]"
  },
  {
    number: "02",
    icon: Users,
    title: "Capture Investors",
    description: "Add incoming investors and link them to the exact source where they discovered your project.",
    gradient: "from-[#0088b3] to-[#00688b]"
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track Progress",
    description: "Move investors through your pipeline: Lead → Contacted → Meeting → Negotiation → Closed.",
    gradient: "from-[#005570] to-[#00344a]"
  },
  {
    number: "04",
    icon: Target,
    title: "Measure & Optimize",
    description: "See which platforms generate the most leads, meetings, and deals. Focus on what works.",
    gradient: "from-[#00a8d8] to-[#0088b3]"
  }
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".fade-in-section")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white dark:bg-black">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f4f8] via-white to-[#e6f4f8] dark:from-[#00344a]/20 dark:via-black dark:to-[#00344a]/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00688b]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0088b3]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center py-20">
          <div className="fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-[#00688b] dark:text-[#0088b3] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#00688b]/20">
                Process
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-[#00688b] via-[#0088b3] to-[#00a8d8] bg-clip-text text-transparent animate-gradient">
                Pozz.io
              </span>
              {" "}Works
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A simple, structured approach to managing your entire fundraising process
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="relative py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0
              return (
                <div
                  key={index}
                  className="fade-in-section opacity-0 transition-all duration-1000"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                    {/* Number & Icon Side */}
                    <div className={`relative ${isEven ? '' : 'lg:col-start-2'}`}>
                      <div className="relative group flex items-center justify-center">
                        {/* Glowing background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-10 blur-3xl rounded-full scale-150 group-hover:opacity-20 transition-opacity duration-700`} />
                        
                        {/* Large Number */}
                        <div className="relative">
                          <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-700`}>
                            <div className="relative">
                              <span className="text-6xl md:text-7xl font-bold text-white/20 absolute -top-2 -left-2 select-none">
                                {step.number}
                              </span>
                              <Icon className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10" />
                            </div>
                          </div>
                          {/* Animated ring */}
                          <div className={`absolute inset-0 rounded-full border-2 border-[#00688b]/30 animate-ping-slow`} />
                        </div>

                        {/* Decorative background circle */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br ${step.gradient} opacity-5`} />
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-0.5 bg-gradient-to-r ${step.gradient} rounded-full`} />
                            <span className="text-sm font-bold text-[#00688b] dark:text-[#0088b3] tracking-wider">
                              STEP {step.number}
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator (except last) */}
                  {index < steps.length - 1 && (
                    <div className="mt-16 relative flex justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-1 h-12 bg-gradient-to-b ${step.gradient} rounded-full opacity-30`} />
                        <ArrowRight className="w-6 h-6 text-[#00688b]/50 transform rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="fade-in-section opacity-0 transition-all duration-1000 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00688b] via-[#005570] to-[#00344a] p-10 md:p-12">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Organize Your Fundraising?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Start tracking your investor pipeline with clarity and confidence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={AUTH_CONFIG.SIGNUP_URL} className="group px-6 py-3 bg-white text-[#00688b] font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:scale-105">
                  Watch Demo
                </button>
              </div>
              <p className="text-white/70 text-xs mt-4">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .fade-in-section.animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </section>
  )
}
