'use client'

import { motion, Variants } from "framer-motion"
import { RefObject, useEffect, useState, ElementType } from "react"
import { useInView } from "framer-motion"

interface TimelineContentProps {
  children: React.ReactNode
  as?: ElementType
  animationNum: number
  timelineRef: RefObject<HTMLElement | HTMLDivElement | null>
  customVariants?: Variants
  className?: string
}

export function TimelineContent({
  children,
  as: Component = "div",
  animationNum,
  timelineRef,
  customVariants,
  className,
  ...props
}: TimelineContentProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(timelineRef, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const variants = customVariants || defaultVariants

  return (
    <motion.div
      custom={animationNum}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
