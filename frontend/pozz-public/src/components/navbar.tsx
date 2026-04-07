"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AUTH_CONFIG } from "@/lib/config"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50" />
      
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group">
            <Image 
              src="/pozz-logo.png" 
              alt="Pozz.io Logo" 
              width={120} 
              height={40}
              className="h-10 w-auto group-hover:scale-105 transition-transform"
              priority
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-[#00688b] dark:hover:text-[#0088b3] transition-colors px-3 py-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" asChild className="hover:bg-gray-100 dark:hover:bg-gray-900">
            <a href={AUTH_CONFIG.LOGIN_URL}>Log in</a>
          </Button>
          <Button asChild className="shadow-lg shadow-[#00688b]/20 hover:shadow-[#00688b]/40 transition-all hover:scale-105">
            <a href={AUTH_CONFIG.SIGNUP_URL}>Get Started</a>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative">
          <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50" />
          <div className="relative space-y-1 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-[#e6f4f8] dark:hover:bg-[#00344a]/20 hover:text-[#00688b] dark:hover:text-[#0088b3] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <a href={AUTH_CONFIG.LOGIN_URL}>Log in</a>
              </Button>
              <Button className="w-full shadow-lg shadow-[#00688b]/20" asChild>
                <a href={AUTH_CONFIG.SIGNUP_URL}>Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
