import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const ProgressBar = React.forwardRef(({ 
  className, 
  progress = 0, 
  animated = false,
  showPercentage = true,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  }
  
  return (
    <div 
      className={cn("relative rounded-full bg-surface/50 overflow-hidden", sizes[size], className)}
      ref={ref}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full",
          animated && "progress-stripes"
        )}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      {showPercentage && size === "lg" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
})

ProgressBar.displayName = "ProgressBar"

export default ProgressBar