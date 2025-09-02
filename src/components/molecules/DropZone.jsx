import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const DropZone = ({ onFilesSelected, maxFiles = 10, acceptedTypes = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles))
    }
  }
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles))
    }
    // Reset input value to allow selecting same files again
    e.target.value = ""
  }
  
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <motion.div
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        cursor-pointer select-none
        ${isDragOver 
          ? "drop-zone-active border-primary bg-primary/10" 
          : "border-gray-600 hover:border-gray-500 glass-effect"
        }
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept={acceptedTypes.join(",")}
      />
      
      <motion.div
        className="flex flex-col items-center"
        animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={`
            w-20 h-20 rounded-full mb-6 flex items-center justify-center
            ${isDragOver 
              ? "bg-gradient-to-r from-primary via-secondary to-accent" 
              : "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
            }
          `}
          animate={isDragOver ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            size={32} 
            className={isDragOver ? "text-white" : "gradient-text"} 
          />
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-3 ${isDragOver ? "text-white" : "gradient-text"}`}>
          {isDragOver ? "Drop files here" : "Drag & drop files"}
        </h3>
        
        <p className="text-gray-400 mb-6 text-lg">
          or click to browse your computer
        </p>
        
        <Button 
          variant={isDragOver ? "secondary" : "primary"}
          className="mb-6"
        >
          <ApperIcon name="FolderOpen" size={16} className="mr-2" />
          Select Files
        </Button>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Maximum {maxFiles} files</p>
          <p>Supports images, documents, and videos</p>
          <p>Up to 10MB per file</p>
        </div>
      </motion.div>
      
      {isDragOver && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

export default DropZone