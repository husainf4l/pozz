"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Target, Users, Zap, Heart, ArrowRight, Sparkles } from "lucide-react"
import { AUTH_CONFIG } from "@/lib/config"

const values = [
  {
    icon: Target,
    title: "Founder-Focused",
    description: "Built by founders, for founders. We understand the fundraising journey because we've lived it.",
    gradient: "from-[#00688b] to-[#005570]"
  },
  {
    icon: Users,
    title: "Transparency First",
    description: "No black boxes. Clear data, honest metrics, and full visibility into your fundraising pipeline.",
    gradient: "from-[#0088b3] to-[#00688b]"
  },
  {
    icon: Zap,
    title: "Simplicity Wins",
    description: "Powerful features without the complexity. Get up and running in minutes, not weeks.",
    gradient: "from-[#005570] to-[#00344a]"
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Your feedback shapes our roadmap. We're building this together with the startup community.",
    gradient: "from-[#00a8d8] to-[#0088b3]"
  }
]

export function About() {
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
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-white dark:bg-black">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f4f8] via-white to-[#e6f4f8] dark:from-[#00344a]/20 dark:via-black dark:to-[#00344a]/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00688b]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0088b3]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center py-20">
          <div className="fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-[#00688b]/20">
              <Sparkles className="w-4 h-4 text-[#00688b]" />
              <span className="text-sm font-semibold text-[#00688b] dark:text-[#0088b3]">
                About Pozz.io
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              Building the Future of{" "}
              <span className="bg-gradient-to-r from-[#00688b] via-[#0088b3] to-[#00a8d8] bg-clip-text text-transparent animate-gradient">
                Fundraising
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to make fundraising simple, transparent, and data-driven for every startup founder worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section - Split Layout with Image */}
      <div className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image Placeholder */}
            <div className="fade-in-section opacity-0 transition-all duration-1000 translate-x-[-50px]">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00688b] to-[#0088b3] rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                  <Image
                    src="/about.jpg"
                    alt="Pozz.io Team"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="fade-in-section opacity-0 transition-all duration-1000 translate-x-[50px] space-y-8">
              <div>
                <div className="inline-block mb-4">
                  <span className="text-[#00688b] dark:text-[#0088b3] font-bold text-sm tracking-wider uppercase">
                    The Problem
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Fundraising is Broken
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Founders juggle spreadsheets, forget which platform brought in which investor, and lose track of conversations. 
                  The chaos costs time, money, and deals. We built Pozz.io to solve this.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-[#00688b]/50 via-[#0088b3]/50 to-transparent" />

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  To make fundraising transparent and data-driven. Every founder deserves to know what's working 
                  and how to optimize their outreach. We're leveling the playing field.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00688b] to-[#0088b3] border-2 border-white dark:border-black flex items-center justify-center text-white font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">10,000+ Founders</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Trust Pozz.io</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section - Modern Flow Layout */}
      <div className="relative py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="fade-in-section opacity-0 transition-all duration-1000 text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              What We{" "}
              <span className="bg-gradient-to-r from-[#00688b] to-[#0088b3] bg-clip-text text-transparent">
                Stand For
              </span>
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Our values drive everything we build
            </p>
          </div>

          <div className="space-y-12">
            {values.map((value, index) => {
              const Icon = value.icon
              const isEven = index % 2 === 0
              return (
                <div
                  key={index}
                  className="fade-in-section opacity-0 transition-all duration-1000"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                    {/* Icon Side */}
                    <div className={`relative ${isEven ? '' : 'lg:col-start-2'}`}>
                      <div className="relative group">
                        {/* Glowing background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700 rounded-full scale-150`} />
                        
                        {/* Large Icon */}
                        <div className="relative inline-flex">
                          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${value.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-700 shadow-xl`}>
                            <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                          </div>
                          
                          {/* Animated ring */}
                          <div className={`absolute inset-0 rounded-full border-2 border-[#00688b]/30 animate-ping-slow`} />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${value.gradient} opacity-5`} />
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                      <div className="space-y-3">
                        <div>
                          <div className={`inline-block w-10 h-0.5 bg-gradient-to-r ${value.gradient} rounded-full mb-3`} />
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                            {value.title}
                          </h3>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider (except last) */}
                  {index < values.length - 1 && (
                    <div className="mt-12 relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                      </div>
                      <div className="relative flex justify-center">
                        <div className={`px-4 bg-gradient-to-r ${value.gradient} w-1.5 h-1.5 rounded-full`} />
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
      <div className="relative py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="fade-in-section opacity-0 transition-all duration-1000 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00688b] via-[#005570] to-[#00344a] p-10 md:p-12">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Fundraising?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Join thousands of founders who've already streamlined their journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={AUTH_CONFIG.SIGNUP_URL} className="group px-6 py-3 bg-white text-[#00688b] font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:scale-105">
                  Schedule a Demo
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
