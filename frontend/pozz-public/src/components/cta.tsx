import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AUTH_CONFIG } from "@/lib/config"

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dramatic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-950 dark:to-black" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00688b]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00688b]/20 rounded-full blur-3xl animate-pulse" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 104, 139, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 104, 139, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
        {/* Content */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8">
          Stop Guessing.{" "}
          <span className="bg-gradient-to-r from-[#0088b3] to-[#00a8d8] bg-clip-text text-transparent">
            Start Tracking.
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join startups who know exactly where their investors come from and which channels actually work.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-10 py-7 shadow-2xl shadow-[#00688b]/50 hover:shadow-[#00688b]/70 transition-all hover:scale-105">
            <a href={AUTH_CONFIG.SIGNUP_URL} className="flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            <a href="#features">Learn More</a>
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="mt-12 text-sm text-gray-400">
          No credit card required • Setup in 5 minutes • Cancel anytime
        </p>
      </div>
    </section>
  )
}
