import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading files..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <motion.div
        className="relative mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary via-secondary to-accent p-0.5">
          <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" size={24} className="text-primary" />
          </div>
        </div>
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold gradient-text mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.h3>
      
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Loading