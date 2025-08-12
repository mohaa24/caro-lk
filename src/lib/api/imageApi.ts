import { apiClient } from './client';

export interface ImageUploadResponse {
  url: string;
  filename: string;
}

export interface MultipleImageUploadResponse {
  urls: string[];
  count: number;
  message: string;
}

export const imageApi = {
  // Upload a single image
  uploadSingle: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ImageUploadResponse>('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Upload multiple images
  uploadMultiple: async (files: File[]): Promise<MultipleImageUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<MultipleImageUploadResponse>('/api/images/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Delete an image
  deleteImage: async (imageUrl: string): Promise<void> => {
    await apiClient.delete('/api/images/delete', {
      data: { url: imageUrl },
    });
  },
};
