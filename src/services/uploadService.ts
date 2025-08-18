import { apiClient, APIResponse } from './api';

export interface ProfilePhoto {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
  metadata?: PhotoMetadata;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  uploadedAt: string;
}

export interface UploadStats {
  totalPhotos: number;
  maxPhotos: number;
  totalSize: number;
  maxSize: number;
  remainingSlots: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fields: Record<string, string>;
  expiresIn: number;
}

export interface ChatMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  metadata?: MediaMetadata;
  uploadedAt: string;
}

export interface MediaMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class UploadService {
  async uploadProfilePhoto(
    photoFile: File | FormData,
    isPrimary: boolean = false,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<ProfilePhoto>> {
    const formData = new FormData();
    
    if (photoFile instanceof File) {
      formData.append('photo', photoFile);
    } else {
      // If already FormData, use it directly
      return await this.uploadWithProgress('/uploads/profile-photo', photoFile, onProgress);
    }
    
    formData.append('isPrimary', isPrimary.toString());

    return await this.uploadWithProgress('/uploads/profile-photo', formData, onProgress);
  }

  async deleteProfilePhoto(photoId: string): Promise<APIResponse> {
    return await apiClient.delete(`/uploads/profile-photo/${photoId}`);
  }

  async reorderPhotos(photoIds: string[]): Promise<APIResponse<ProfilePhoto[]>> {
    return await apiClient.put<ProfilePhoto[]>('/uploads/profile-photos/reorder', {
      photoIds,
    });
  }

  async setPrimaryPhoto(photoId: string): Promise<APIResponse<ProfilePhoto>> {
    return await apiClient.put<ProfilePhoto>(`/uploads/profile-photo/${photoId}/primary`);
  }

  async batchUploadPhotos(
    photos: (File | Blob)[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<ProfilePhoto[]>> {
    const formData = new FormData();
    
    photos.forEach((photo, index) => {
      formData.append('photos', photo, `photo_${index}`);
    });

    return await this.uploadWithProgress('/uploads/profile-photos/batch', formData, onProgress);
  }

  async uploadChatMedia(
    mediaFile: File | Blob,
    type: 'IMAGE' | 'VIDEO' | 'AUDIO',
    conversationId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<ChatMedia>> {
    const formData = new FormData();
    formData.append('media', mediaFile);
    formData.append('type', type);
    formData.append('conversationId', conversationId);

    return await this.uploadWithProgress('/uploads/chat-media', formData, onProgress);
  }

  async getUploadStats(): Promise<APIResponse<UploadStats>> {
    return await apiClient.get<UploadStats>('/uploads/stats');
  }

  async getPresignedUrl(
    fileName: string,
    fileType: string,
    purpose: 'PROFILE_PHOTO' | 'CHAT_MEDIA'
  ): Promise<APIResponse<PresignedUrlResponse>> {
    return await apiClient.post<PresignedUrlResponse>('/uploads/presigned-url', {
      fileName,
      fileType,
      purpose,
    });
  }

  // Direct upload to presigned URL
  async uploadToPresignedUrl(
    presignedUrl: PresignedUrlResponse,
    file: File | Blob,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      
      // Add required fields from presigned URL
      Object.entries(presignedUrl.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            resolve({
              success: true,
              data: { url: presignedUrl.publicUrl },
            });
          } else {
            resolve({
              success: false,
              error: 'Upload failed',
            });
          }
        };

        xhr.onerror = () => {
          resolve({
            success: false,
            error: 'Network error during upload',
          });
        };

        xhr.open('POST', presignedUrl.uploadUrl);
        xhr.send(formData);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  private async uploadWithProgress<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const xhr = new XMLHttpRequest();

      return new Promise((resolve) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.responseText);
            
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                success: true,
                data: response,
                message: response.message,
              });
            } else {
              resolve({
                success: false,
                error: response.error || 'Upload failed',
              });
            }
          } catch (error) {
            resolve({
              success: false,
              error: 'Failed to parse response',
            });
          }
        };

        xhr.onerror = () => {
          resolve({
            success: false,
            error: 'Network error during upload',
          });
        };

        xhr.open('POST', `${this.getBaseUrl()}${endpoint}`);
        
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Helper methods for image processing
  async compressImage(
    file: File,
    maxWidth: number = 1080,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  async validateImage(file: File): Promise<{ isValid: boolean; error?: string }> {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: 'Image must be less than 10MB' };
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const minDimension = 300;
        if (img.width < minDimension || img.height < minDimension) {
          resolve({
            isValid: false,
            error: `Image must be at least ${minDimension}x${minDimension} pixels`,
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => {
        resolve({ isValid: false, error: 'Invalid image file' });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private async getAuthToken(): Promise<string | null> {
    // Import AsyncStorage dynamically to avoid issues in web environment
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.default.getItem('authToken');
    } catch {
      return null;
    }
  }

  private getBaseUrl(): string {
    return 'http://localhost:3001/api';
  }
}

export const uploadService = new UploadService();