import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No files uploaded yet", 
  description = "Drag and drop files here or click to select",
  onAction,
  actionLabel = "Select Files"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ApperIcon name="FileUp" size={36} className="gradient-text" />
      </motion.div>
      
      <h3 className="text-2xl font-bold gradient-text mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
      
      <motion.div
        className="mt-8 flex items-center space-x-6 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <ApperIcon name="Image" size={16} />
          <span>Images</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="FileText" size={16} />
          <span>Documents</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Video" size={16} />
          <span>Videos</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Empty