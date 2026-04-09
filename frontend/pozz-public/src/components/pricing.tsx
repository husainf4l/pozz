import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for testing and early-stage startups",
    features: [
      { name: "1 active project", included: true },
      { name: "Up to 50 investors", included: true },
      { name: "Basic pipeline tracking", included: true },
      { name: "Distribution tracking", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Team collaboration", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For startups actively fundraising",
    features: [
      { name: "5 active projects", included: true },
      { name: "Unlimited investors", included: true },
      { name: "Full pipeline management", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Distribution tracking", included: true },
      { name: "Team collaboration (3 users)", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with multiple startups",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "Unlimited investors", included: true },
      { name: "Full pipeline management", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Distribution tracking", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Dedicated support", included: true },
      { name: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="relative py-32 overflow-hidden bg-white dark:bg-black">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full">
              Pricing
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your fundraising needs. All plans include core features.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Yearly <span className="text-red-600 dark:text-red-500 font-semibold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-2xl shadow-red-600/30 transform scale-105"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-red-100" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span className={`ml-2 ${plan.popular ? "text-red-100" : "text-gray-600 dark:text-gray-400"}`}>
                      /{plan.period}
                    </span>
                  )}
                  {plan.price === "Custom" && (
                    <span className={`ml-2 text-sm ${plan.popular ? "text-red-100" : "text-gray-600 dark:text-gray-400"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className={`w-full mb-8 py-6 ${
                  plan.popular
                    ? "bg-white text-red-600 hover:bg-gray-100"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              {/* Features */}
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-white" : "text-red-600 dark:text-red-500"}`} />
                    ) : (
                      <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-red-200" : "text-gray-400 dark:text-gray-600"}`} />
                    )}
                    <span className={`text-sm ${
                      feature.included
                        ? plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                        : plan.popular ? "text-red-200" : "text-gray-500 dark:text-gray-500"
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions? We have answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, Professional and Enterprise plans come with a 14-day free trial. No credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. No questions asked."
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
