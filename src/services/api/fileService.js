import { simulateDelay } from "@/utils/helpers"

class FileService {
  async uploadFile(file, onProgress) {
    // Simulate file upload with progress
    const chunks = 20 // Simulate 20 progress updates
    const chunkDelay = Math.random() * 200 + 100 // 100-300ms per chunk
    
    for (let i = 0; i <= chunks; i++) {
      await simulateDelay(chunkDelay)
      
      const progress = (i / chunks) * 100
      const speed = file.size / (chunks * chunkDelay / 1000) // Bytes per second
      
      onProgress?.(progress, speed)
      
      // Simulate random upload failures (5% chance)
      if (Math.random() < 0.05 && i > 5) {
        throw new Error("Network error occurred")
      }
    }
    
    return {
      id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: `https://example.com/files/${file.name}`,
      checksum: Math.random().toString(36).substr(2, 16)
    }
  }
  
  async getUploadHistory() {
    await simulateDelay(300)
    
    // Return mock upload history
    return [
      {
        id: "1",
        originalName: "document.pdf",
        size: 2048576,
        type: "application/pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: "completed"
      },
      {
        id: "2",
        originalName: "image.jpg", 
        size: 1536000,
        type: "image/jpeg",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "completed"
      }
    ]
  }
  
  async deleteFile(fileId) {
    await simulateDelay(200)
    
    // Simulate file deletion
    if (Math.random() < 0.1) {
      throw new Error("Failed to delete file")
    }
    
    return { success: true, fileId }
  }
}

export const fileService = new FileService()