"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import { CheckCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { AUTH_CONFIG } from "@/lib/config"

const plans = [
  {
    name: "Starter",
    description: "Perfect for early-stage founders testing the waters",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    features: [
      "Track up to 10 investors",
      "3 platform sources",
      "Basic pipeline tracking",
      "Email support",
      "Core analytics"
    ],
    popular: false
  },
  {
    name: "Pro",
    description: "For startups actively raising funds",
    price: 49,
    yearlyPrice: 470,
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    features: [
      "Unlimited investors",
      "Unlimited platform sources",
      "Advanced pipeline management",
      "Priority email & chat support",
      "Advanced analytics & insights",
      "Export data",
      "Integration with CRM tools",
      "Custom fields"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    description: "For venture firms and accelerators",
    price: 0,
    yearlyPrice: 0,
    customPrice: "Custom",
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    features: [
      "Everything in Pro",
      "Multi-company portfolio tracking",
      "Team collaboration",
      "Dedicated account manager",
      "Custom integrations",
      "SLA & priority support",
      "Advanced security",
      "Custom reporting"
    ],
    popular: false
  }
]

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void
  className?: string
}) => {
  const [selected, setSelected] = useState("0")

  const handleSwitch = (value: string) => {
    setSelected(value)
    onSwitch(value)
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-[#e6f4f8] dark:bg-[#00344a]/30 border border-[#00688b]/20 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0"
              ? "text-white"
              : "text-gray-700 dark:text-gray-300 hover:text-[#00688b]"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-gradient-to-r from-[#00688b] to-[#005570] shadow-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1"
              ? "text-white"
              : "text-gray-700 dark:text-gray-300 hover:text-[#00688b]"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-gradient-to-r from-[#00688b] to-[#005570] shadow-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-[#00688b]/10 dark:bg-[#0088b3]/20 px-2 py-0.5 text-xs font-medium text-[#00688b] dark:text-[#0088b3]">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  }

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1)

  return (
    <div
      id="pricing"
      className="px-4 pt-20 pb-32 min-h-screen max-w-7xl mx-auto relative bg-white dark:bg-black"
      ref={pricingRef}
    >
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00688b]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0088b3]/10 rounded-full blur-3xl" />

      <article className="relative flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between mb-12">
        <div className="text-left mb-6">
          <h2 className="text-4xl font-bold leading-[130%] text-gray-900 dark:text-white mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Simple, Transparent Pricing
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-gray-600 dark:text-gray-400 w-[80%]"
          >
            Choose the plan that fits your fundraising journey. No hidden fees.
          </TimelineContent>
        </div>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
        </TimelineContent>
      </article>

      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative grid md:grid-cols-3 gap-6 mx-auto bg-gradient-to-b from-[#e6f4f8] to-[#e6f4f8]/50 dark:from-[#00344a]/20 dark:to-[#00344a]/10 sm:p-6 p-3 rounded-2xl"
      >
        {plans.map((plan, index) => (
          <TimelineContent
            as="div"
            key={plan.name}
            animationNum={index + 3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative flex-col flex justify-between h-full ${
                plan.popular
                  ? "scale-105 ring-2 ring-[#00688b] bg-gradient-to-br from-[#00688b] to-[#005570] text-white shadow-2xl shadow-[#00688b]/30"
                  : "border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 pt-4 text-gray-900 dark:text-white"
              }`}
            >
              <CardContent className="pt-0">
                <div className="space-y-2 pb-3">
                  {plan.popular && (
                    <div className="pt-4">
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline pt-4">
                    {plan.customPrice ? (
                      <span className="text-4xl font-bold">{plan.customPrice}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          $
                          <NumberFlow
                            value={isYearly ? plan.yearlyPrice : plan.price}
                            className="text-4xl font-bold"
                          />
                        </span>
                        <span
                          className={
                            plan.popular
                              ? "text-white/80 ml-2"
                              : "text-gray-600 dark:text-gray-400 ml-2"
                          }
                        >
                          /{isYearly ? "year" : "month"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                </div>
                <p
                  className={
                    plan.popular
                      ? "text-sm text-white/80 mb-6"
                      : "text-sm text-gray-600 dark:text-gray-400 mb-6"
                  }
                >
                  {plan.description}
                </p>

                <div className="space-y-3">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span
                          className={
                            plan.popular
                              ? "text-white h-5 w-5 bg-white/20 rounded-full grid place-content-center mt-0.5 mr-3 flex-shrink-0"
                              : "text-[#00688b] h-5 w-5 bg-[#00688b]/10 rounded-full grid place-content-center mt-0.5 mr-3 flex-shrink-0"
                          }
                        >
                          <CheckCheck className="h-3 w-3" />
                        </span>
                        <span
                          className={
                            plan.popular
                              ? "text-sm text-white/90"
                              : "text-sm text-gray-700 dark:text-gray-300"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <a
                  href={AUTH_CONFIG.SIGNUP_URL}
                  className={`w-full p-4 text-base font-semibold rounded-xl transition-all hover:scale-105 flex items-center justify-center ${
                    plan.popular
                      ? "bg-white text-[#00688b] hover:bg-gray-100 shadow-lg"
                      : "bg-gradient-to-r from-[#00688b] to-[#005570] text-white hover:from-[#005570] hover:to-[#00344a] shadow-md"
                  }`}
                >
                  {plan.buttonText}
                </a>
              </CardFooter>
            </Card>
          </TimelineContent>
        ))}
      </TimelineContent>

      <TimelineContent
        as="div"
        animationNum={6}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="text-center mt-12"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </TimelineContent>
    </div>
  )
}
