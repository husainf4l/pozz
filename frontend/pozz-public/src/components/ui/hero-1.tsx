"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere"

// Sample images for the sphere
const SPHERE_IMAGES: ImageData[] = [
  {
    id: "img-1",
    src: "https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?w=400&q=80",
    alt: "Investor Meeting",
    title: "Track Investors",
  },
  {
    id: "img-2",
    src: "https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?w=400&q=80",
    alt: "Fundraising Pipeline",
    title: "Manage Pipeline",
  },
  {
    id: "img-3",
    src: "https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?w=400&q=80",
    alt: "Deal Analytics",
    title: "Close Deals",
  },
  {
    id: "img-4",
    src: "https://images.unsplash.com/photo-1742201877377-03d18a323c18?w=400&q=80",
    alt: "Distribution Tracking",
    title: "Track Posts",
  },
  {
    id: "img-5",
    src: "https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?w=400&q=80",
    alt: "Team Collaboration",
    title: "Collaborate",
  },
  {
    id: "img-6",
    src: "https://images.unsplash.com/photo-1757626961383-be254afee9a0?w=400&q=80",
    alt: "Performance Metrics",
    title: "Measure Results",
  },
  {
    id: "img-7",
    src: "https://images.unsplash.com/photo-1756748371390-099e4e6683ae?w=400&q=80",
    alt: "Investor Relations",
    title: "Build Relationships",
  },
  {
    id: "img-8",
    src: "https://images.unsplash.com/photo-1755884405235-5c0213aa3374?w=400&q=80",
    alt: "Negotiation Tools",
    title: "Track Negotiations",
  },
  {
    id: "img-9",
    src: "https://images.unsplash.com/photo-1757495404191-e94ed7e70046?w=400&q=80",
    alt: "Meeting Notes",
    title: "Log Meetings",
  },
  {
    id: "img-10",
    src: "https://images.unsplash.com/photo-1756197256528-f9e6fcb82b04?w=400&q=80",
    alt: "Data Room",
    title: "Store Files",
  },
  {
    id: "img-11",
    src: "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?w=400&q=80",
    alt: "Timeline View",
    title: "Track History",
  },
  {
    id: "img-12",
    src: "https://images.unsplash.com/photo-1755278338891-e8d8481ff087?w=400&q=80",
    alt: "Dashboard",
    title: "View Analytics",
  },
].map((img, i) => {
  // Duplicate for more coverage
  return Array(5).fill(null).map((_, j) => ({
    ...img,
    id: `${img.id}-${j}`
  }))
}).flat();

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-40 px-6 md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)]  
      dark:bg-[linear-gradient(to_bottom,#000,#0000_30%,#898e8e_78%,#ffffff_99%_50%)] 
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] border-[#B48CDE] bg-white dark:bg-black 
        bg-[radial-gradient(closest-side,#fff_82%,#000000)] 
        dark:bg-[radial-gradient(closest-side,#000_82%,#ffffff)] 
        animate-fade-up"
      />

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="z-10">
          {/* Eyebrow */}
          {eyebrow && (
            <a href="#" className="group inline-block">
              <span
                className="text-sm text-gray-600 dark:text-gray-400 font-geist px-5 py-2 
                bg-gradient-to-tr from-red-500/10 via-gray-400/5 to-transparent  
                border-[2px] border-red-500/20 dark:border-red-500/30 
                rounded-3xl w-fit tracking-tight uppercase inline-flex items-center justify-center
                hover:border-red-500/40 dark:hover:border-red-500/50 transition-colors"
              >
                {eyebrow}
                <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          )}

          {/* Title */}
          <h1
            className="animate-fade-in -translate-y-4 text-balance 
            bg-gradient-to-br from-black from-30% to-black/40 
            bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter 
            text-transparent opacity-0 sm:text-6xl md:text-7xl 
            dark:from-white dark:to-white/40 max-w-4xl"
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in mb-12 -translate-y-4 text-balance 
            text-lg tracking-tight text-gray-600 dark:text-gray-400 
            opacity-0 md:text-xl max-w-2xl"
          >
            {subtitle}
          </p>

          {/* CTA */}
          {ctaLabel && (
            <div className="flex">
              <Button
                asChild
                className="mt-[-20px] w-fit md:w-52 z-20 font-geist tracking-tighter text-center text-lg"
              >
                <a href={ctaHref}>{ctaLabel}</a>
              </Button>
            </div>
          )}
        </div>

        {/* Right Sphere Animation */}
        <div className="hidden lg:flex justify-center items-center z-10">
          <SphereImageGrid
            images={SPHERE_IMAGES}
            containerSize={620}
            sphereRadius={220}
            dragSensitivity={0.8}
            momentumDecay={0.96}
            maxRotationSpeed={6}
            baseImageScale={0.15}
            hoverScale={1.2}
            perspective={1000}
            autoRotate={true}
            autoRotateSpeed={0.2}
          />
        </div>
      </div>

      {/* Bottom Fade */}
      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </section>
  )
}
