import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Pozz.io helped us track everything in one place. We closed our seed round 2 months faster.",
    author: "Sarah Chen",
    role: "CEO",
    company: "TechFlow AI",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
  },
  {
    quote: "Finally, we know which platforms actually work. No more guessing where leads come from.",
    author: "Marcus Rodriguez",
    role: "Founder",
    company: "DataSync",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
  },
  {
    quote: "The pipeline view is a game-changer. We can see exactly where each investor stands.",
    author: "Emily Watson",
    role: "Co-Founder",
    company: "HealthTech Labs",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60"
  }
]

export function Testimonials() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            See what startup founders say about Pozz.io
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-800/50
                rounded-2xl p-8
                hover:border-red-500/50 dark:hover:border-red-500/50
                hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20
                transition-all duration-500 hover:-translate-y-2">
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote Icon */}
                <div className="absolute -top-5 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500
                    rounded-full flex items-center justify-center
                    shadow-lg group-hover:shadow-red-500/50 group-hover:scale-110
                    transition-all duration-500">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="relative mt-6 mb-8">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                {/* Author */}
                <div className="relative flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-red-500/50 transition-all"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-medium">
            Join 200+ startups managing their fundraising on Pozz.io
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {[
              { name: "Y Combinator", logo: "YC" },
              { name: "Techstars", logo: "TS" },
              { name: "500 Global", logo: "500" },
              { name: "Seedcamp", logo: "SC" }
            ].map((accelerator, index) => (
              <div
                key={index}
                className="text-gray-400 dark:text-gray-600 font-bold text-lg
                  tracking-wider hover:text-red-600 dark:hover:text-red-500
                  transition-all duration-300 hover:scale-110 cursor-default"
              >
                {accelerator.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
