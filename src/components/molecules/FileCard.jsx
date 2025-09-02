import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ProgressBar from "@/components/atoms/ProgressBar"
import ApperIcon from "@/components/ApperIcon"
import { formatFileSize, getFileIcon } from "@/utils/fileHelpers"

const FileCard = ({ file, onRemove, onRetry }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "uploading":
        return "text-primary"
      default:
        return "text-gray-400"
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle"
      case "error":
        return "XCircle"
      case "uploading":
        return "Loader"
      default:
        return "Clock"
    }
  }
  
  return (
    <motion.div
      className="glass-effect rounded-xl p-4 border border-white/10"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex items-start gap-4">
        {/* File Thumbnail/Icon */}
        <div className="flex-shrink-0">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface/50 flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                size={20} 
                className="text-gray-400" 
              />
            </div>
          )}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {file.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="uppercase">{file.type.split("/")[1] || "file"}</span>
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-2 ml-2">
              <motion.div
                animate={file.status === "uploading" ? { rotate: 360 } : {}}
                transition={file.status === "uploading" ? { 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                } : {}}
              >
                <ApperIcon
                  name={getStatusIcon(file.status)}
                  size={16}
                  className={getStatusColor(file.status)}
                />
              </motion.div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                {file.status === "error" && onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRetry(file.id)}
                    className="h-6 w-6 p-0"
                  >
                    <ApperIcon name="RefreshCw" size={12} />
                  </Button>
                )}
                
                {(file.status === "pending" || file.status === "error") && onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(file.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                  >
                    <ApperIcon name="X" size={12} />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {file.status === "uploading" && (
            <div className="mb-2">
              <ProgressBar
                progress={file.progress}
                animated
                size="sm"
                className="mb-1"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{Math.round(file.progress)}%</span>
                {file.uploadSpeed && (
                  <span>{formatFileSize(file.uploadSpeed)}/s</span>
                )}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {file.status === "error" && file.error && (
            <div className="text-xs text-red-400 mt-2">
              {file.error}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard