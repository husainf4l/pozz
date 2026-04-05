import Link from "next/link"

const navigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
  ],
}

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 dark:from-white dark:via-gray-50 dark:to-white border-t border-gray-800/50 dark:border-gray-200/50 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-bold bg-gradient-to-r from-white via-red-500 to-white dark:from-black dark:via-red-600 dark:to-black bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
                Pozz.io
              </span>
            </Link>
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-600 leading-relaxed">
              Manage fundraising, track investors, and close deals with clarity.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-white dark:text-black uppercase tracking-wider mb-6">
              Product
            </h3>
            <ul className="space-y-4">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-600 transition-all text-sm hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white dark:text-black uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-600 transition-all text-sm hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white dark:text-black uppercase tracking-wider mb-6">
              Legal
            </h3>
            <ul className="space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-600 transition-all text-sm hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 dark:border-gray-200/50">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Pozz.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
