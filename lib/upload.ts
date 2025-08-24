import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configure axios with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UploadResponse {
  success: boolean;
  url: string;
  public_id: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// Upload image to Cloudinary
export const uploadImage = async (file: File, folder: string = 'hccc_uploads'): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post(`/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<DeleteResponse> => {
  try {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
