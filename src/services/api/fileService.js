import { toast } from 'react-toastify';

class FileService {
  constructor() {
    this.tableName = 'uploaded_file_c';
    // Initialize ApperClient
    this.getApperClient();
  }

  getApperClient() {
    if (typeof window === 'undefined' || !window.ApperSDK) {
      throw new Error('ApperSDK not loaded');
    }
    
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async uploadFile(file, onProgress) {
    try {
      const apperClient = this.getApperClient();
      
      // Simulate file upload with progress for UI
      const chunks = 20;
      const chunkDelay = Math.random() * 200 + 100;
      
      for (let i = 0; i <= chunks; i++) {
        await new Promise(resolve => setTimeout(resolve, chunkDelay));
        
        const progress = (i / chunks) * 100;
        const speed = file.size / (chunks * chunkDelay / 1000);
        
        onProgress?.(progress, speed);
        
        // Simulate upload failures (5% chance)
        if (Math.random() < 0.05 && i > 5) {
          throw new Error("Network error occurred");
        }
      }
      
      // Create file record in database using only Updateable fields
      const fileRecord = {
        Name: file.name,
        original_name_c: file.name,
        size_c: file.size,
        type_c: file.type,
        uploaded_at_c: new Date().toISOString(),
        status_c: "completed",
        progress_c: 100,
        upload_speed_c: 0,
        url_c: `https://example.com/files/${file.name}`,
        checksum_c: Math.random().toString(36).substr(2, 16),
        thumbnail_c: file.type.startsWith('image/') ? 'thumbnail_url_here' : null
      };

      const createParams = {
        records: [fileRecord]
      };

      const response = await apperClient.createRecord(this.tableName, createParams);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || 'Failed to save file record');
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        const createdRecord = response.results[0].data;
        
        // Return data in format expected by UI components
        return {
          id: createdRecord.Id,
          originalName: createdRecord.original_name_c,
          name: createdRecord.Name,
          size: createdRecord.size_c,
          type: createdRecord.type_c,
          uploadedAt: createdRecord.uploaded_at_c,
          status: createdRecord.status_c,
          progress: createdRecord.progress_c,
          url: createdRecord.url_c,
          checksum: createdRecord.checksum_c,
          thumbnail: createdRecord.thumbnail_c
        };
      } else {
        throw new Error('Failed to create file record');
      }
      
    } catch (error) {
      console.error("Error uploading file:", error?.response?.data?.message || error);
      throw error;
    }
  }
  
  async getUploadHistory() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "original_name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "upload_speed_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "checksum_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database records to UI format
      return response.data.map(record => ({
        id: record.Id,
        originalName: record.original_name_c || record.Name,
        name: record.Name,
        size: record.size_c || 0,
        type: record.type_c || 'application/octet-stream',
        uploadedAt: record.uploaded_at_c || record.CreatedOn,
        status: record.status_c || 'completed',
        progress: record.progress_c || 100,
        uploadSpeed: record.upload_speed_c || 0,
        url: record.url_c,
        checksum: record.checksum_c,
        thumbnail: record.thumbnail_c,
        tags: record.Tags
      }));
      
    } catch (error) {
      console.error("Error fetching upload history:", error?.response?.data?.message || error);
      return [];
    }
  }
  
  async deleteFile(fileId) {
    try {
      const apperClient = this.getApperClient();
      
      const params = { 
        RecordIds: [parseInt(fileId)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || 'Failed to delete file');
      }
      
      if (response.results && response.results.length > 0 && response.results[0].success) {
        return { success: true, fileId };
      } else {
        throw new Error('Failed to delete file');
      }
      
    } catch (error) {
      console.error("Error deleting file:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateFileStatus(fileId, status, progress = null, error = null) {
    try {
      const apperClient = this.getApperClient();
      
      const updateData = {
        Id: parseInt(fileId),
        status_c: status
      };

      if (progress !== null) {
        updateData.progress_c = progress;
      }

      if (error !== null) {
        updateData.error_c = error;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || 'Failed to update file status');
      }

      return response.results?.[0]?.success || false;
      
    } catch (error) {
      console.error("Error updating file status:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const fileService = new FileService()