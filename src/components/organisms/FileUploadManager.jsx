import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import DropZone from "@/components/molecules/DropZone"
import FileCard from "@/components/molecules/FileCard"
import UploadSummary from "@/components/molecules/UploadSummary"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Empty from "@/components/ui/Empty"
import { fileService } from "@/services/api/fileService"
import { generateFileId, createFileItem, validateFile } from "@/utils/fileHelpers"

const FileUploadManager = () => {
  const [files, setFiles] = useState([])
  const [session, setSession] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFilesSelected = useCallback((newFiles) => {
    const validFiles = []
    const errors = []
    
    newFiles.forEach(file => {
      const validation = validateFile(file)
      if (validation.isValid) {
        validFiles.push(createFileItem(file))
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })
    
    if (errors.length > 0) {
      toast.error(`Some files were rejected: ${errors.join(", ")}`)
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added to queue`)
      
      // Initialize session if first files
      if (files.length === 0) {
        setSession({
          totalFiles: validFiles.length,
          completedFiles: 0,
          failedFiles: 0,
          totalSize: validFiles.reduce((sum, f) => sum + f.size, 0),
          startTime: new Date()
        })
      } else {
        setSession(prev => ({
          ...prev,
          totalFiles: prev.totalFiles + validFiles.length,
          totalSize: prev.totalSize + validFiles.reduce((sum, f) => sum + f.size, 0)
        }))
      }
    }
  }, [files.length])
  
  const handleFileRemove = useCallback((fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      const newFiles = prev.filter(f => f.id !== fileId)
      
      if (fileToRemove && session) {
        setSession(prevSession => ({
          ...prevSession,
          totalFiles: prevSession.totalFiles - 1,
          totalSize: prevSession.totalSize - fileToRemove.size
        }))
      }
      
      return newFiles
    })
    toast.info("File removed from queue")
  }, [session])
  
  const handleFileRetry = useCallback(async (fileId) => {
    const fileIndex = files.findIndex(f => f.id === fileId)
    if (fileIndex === -1) return
    
    // Reset file status
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: "pending", error: null, progress: 0 }
        : f
    ))
    
    // Upload the file
    await uploadFile(files[fileIndex])
  }, [files])
  
  const uploadFile = async (file) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id 
        ? { ...f, status: "uploading", progress: 0 }
        : f
    ))
    
    try {
      const result = await fileService.uploadFile(file, (progress, speed) => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress, uploadSpeed: speed }
            : f
        ))
      })
      
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: "completed", progress: 100, uploadSpeed: 0 }
          : f
      ))
      
      setSession(prev => ({
        ...prev,
        completedFiles: prev.completedFiles + 1
      }))
      
      toast.success(`${file.name} uploaded successfully`)
      return result
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: "error", 
              error: error.message || "Upload failed",
              progress: 0,
              uploadSpeed: 0
            }
          : f
      ))
      
      setSession(prev => ({
        ...prev,
        failedFiles: prev.failedFiles + 1
      }))
      
      toast.error(`Failed to upload ${file.name}: ${error.message}`)
      throw error
    }
  }
  
  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === "pending")
    if (pendingFiles.length === 0) return
    
    setIsUploading(true)
    
    try {
      // Upload files in parallel (max 3 concurrent)
      const uploadPromises = []
      for (let i = 0; i < pendingFiles.length; i += 3) {
        const batch = pendingFiles.slice(i, i + 3)
        const batchPromises = batch.map(file => uploadFile(file))
        uploadPromises.push(...batchPromises)
        
        // Wait for current batch to complete before starting next
        if (i + 3 < pendingFiles.length) {
          await Promise.allSettled(batchPromises)
        }
      }
      
      await Promise.allSettled(uploadPromises)
      toast.success("Upload completed!")
      
    } catch (error) {
      toast.error("Some uploads failed")
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleClearAll = () => {
    setFiles([])
    setSession(null)
    toast.info("All files cleared")
  }
  
  const pendingFiles = files.filter(f => f.status === "pending")
  const hasFiles = files.length > 0
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Drop Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        maxFiles={10}
        acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".mp4", ".mov"]}
      />
      
      {/* Upload Summary */}
      <UploadSummary session={session} />
      
      {/* Action Bar */}
      {hasFiles && (
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 p-4 glass-effect rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ApperIcon name="Files" size={16} />
            <span>{files.length} files • {pendingFiles.length} pending</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleClearAll}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear All
            </Button>
            
            <Button
              onClick={handleUploadAll}
              disabled={pendingFiles.length === 0 || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <ApperIcon name="Loader" size={16} />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <ApperIcon name="Upload" size={16} />
                  Upload All ({pendingFiles.length})
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* File List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {hasFiles ? (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onRemove={handleFileRemove}
                onRetry={handleFileRetry}
              />
            ))
          ) : (
            <Empty
              title="Ready to upload"
              description="Drag and drop files above or click to select files from your computer"
              onAction={() => {
                // Trigger file dialog by clicking the hidden drop zone input
                document.querySelector("input[type=file]")?.click()
              }}
              actionLabel="Browse Files"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FileUploadManager