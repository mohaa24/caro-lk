import { useMutation } from '@tanstack/react-query';
import { imageApi } from '../api/imageApi';

// Hook for uploading a single image
export const useUploadSingleImage = () => {
  return useMutation({
    mutationFn: (file: File) => imageApi.uploadSingle(file),
    onError: (error) => {
      console.error('Error uploading image:', error);
    },
  });
};

// Hook for uploading multiple images
export const useUploadMultipleImages = () => {
  return useMutation({
    mutationFn: (files: File[]) => imageApi.uploadMultiple(files),
    onError: (error) => {
      console.error('Error uploading images:', error);
    },
  });
};

// Hook for deleting an image
export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (imageUrl: string) => imageApi.deleteImage(imageUrl),
    onError: (error) => {
      console.error('Error deleting image:', error);
    },
  });
};
