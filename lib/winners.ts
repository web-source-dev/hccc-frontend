import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configure axios with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config ) => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Winner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  game: {
    _id: string;
    name: string;
  };
  amount: number;
  date: string;
  showWinner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWinnerData {
  name: string;
  email: string;
  phone: string;
  location: string;
  game: string;
  amount: number;
  date: string;
  showWinner: boolean;
}

export interface UpdateWinnerData extends Partial<CreateWinnerData> {
  _id: string;
}

// Get all winners (admin only)
export const getWinners = async (): Promise<Winner[]> => {
  try {
    const response = await api.get('/winners');
    return response.data;
  } catch (error) {
    console.error('Error fetching winners:', error);
    throw error;
  }
};

// Get public winners (visible ones)
export const getPublicWinners = async (): Promise<Winner[]> => {
  try {
    const response = await api.get('/winners/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public winners:', error);
    throw error;
  }
};

// Get single winner by ID (admin only)
export const getWinnerById = async (id: string): Promise<Winner> => {
  try {
    const response = await api.get(`/winners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching winner:', error);
    throw error;
  }
};

// Create winner (admin only)
export const createWinner = async (data: CreateWinnerData): Promise<Winner> => {
  try {
    const response = await api.post('/winners', data);
    return response.data;
  } catch (error) {
    console.error('Error creating winner:', error);
    throw error;
  }
};

// Update winner (admin only)
export const updateWinner = async (id: string, data: Partial<CreateWinnerData>): Promise<Winner> => {
  try {
    const response = await api.put(`/winners/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating winner:', error);
    throw error;
  }
};

// Delete winner (admin only)
export const deleteWinner = async (id: string): Promise<void> => {
  try {
    await api.delete(`/winners/${id}`);
  } catch (error) {
    console.error('Error deleting winner:', error);
    throw error;
  }
};

// Toggle winner visibility (admin only)
export const toggleWinnerVisibility = async (id: string, showWinner: boolean): Promise<Winner> => {
  try {
    const response = await api.put(`/winners/${id}`, { showWinner });
    return response.data;
  } catch (error) {
    console.error('Error toggling winner visibility:', error);
    throw error;
  }
};
