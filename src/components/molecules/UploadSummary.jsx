import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { formatFileSize } from "@/utils/fileHelpers"

const UploadSummary = ({ session }) => {
  if (!session || session.totalFiles === 0) return null
  
  const completionRate = (session.completedFiles / session.totalFiles) * 100
  const hasFailures = session.failedFiles > 0
  
  return (
    <motion.div
      className="glass-effect rounded-xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">
          Upload Summary
        </h3>
        
        {completionRate === 100 && !hasFailures && (
          <motion.div
            className="flex items-center gap-2 text-green-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <ApperIcon name="CheckCircle" size={20} />
            <span className="text-sm font-medium">Complete</span>
          </motion.div>
        )}
        
        {hasFailures && (
          <div className="flex items-center gap-2 text-red-400">
            <ApperIcon name="AlertTriangle" size={20} />
            <span className="text-sm font-medium">With Errors</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {session.totalFiles}
          </div>
          <div className="text-sm text-gray-400">Total Files</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {session.completedFiles}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        
        {session.failedFiles > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {session.failedFiles}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text mb-1">
            {formatFileSize(session.totalSize)}
          </div>
          <div className="text-sm text-gray-400">Total Size</div>
        </div>
      </div>
      
      {session.startTime && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Started {new Date(session.startTime).toLocaleTimeString()}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default UploadSummary