export const generateFileId = () => {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B"
  
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "Image"
  if (type.startsWith("video/")) return "Video"
  if (type.startsWith("audio/")) return "Music"
  if (type.includes("pdf")) return "FileText"
  if (type.includes("word") || type.includes("document")) return "FileText"
  if (type.includes("sheet") || type.includes("excel")) return "Sheet"
  if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation"
  if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Archive"
  return "File"
}

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
    "application/pdf",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4", "video/mov", "video/avi", "video/wmv",
    "text/plain", "text/csv"
  ]
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File too large (max 10MB)"
    }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "File type not supported"
    }
  }
  
  return { isValid: true }
}

export const createFileItem = (file) => {
  const item = {
    id: generateFileId(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "pending",
    progress: 0,
    uploadSpeed: 0,
    thumbnail: null,
    error: null,
    file: file // Keep reference to original file object
  }
  
  // Generate thumbnail for images
  if (file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = (e) => {
      item.thumbnail = e.target.result
    }
    reader.readAsDataURL(file)
  }
  
  return item
}

export const getFileTypeCategory = (type) => {
  if (type.startsWith("image/")) return "image"
  if (type.startsWith("video/")) return "video"
  if (type.startsWith("audio/")) return "audio"
  if (type.includes("pdf") || type.includes("document") || type.includes("word")) return "document"
  return "other"
}