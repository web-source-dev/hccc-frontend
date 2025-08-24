import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configure axios with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  showEvent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  showEvent: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  _id: string;
}

// Get all events (admin only)
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get public events (visible ones)
export const getPublicEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get('/events/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }
};

// Get single event by ID (admin only)
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Create event (admin only)
export const createEvent = async (data: CreateEventData): Promise<Event> => {
  try {
    const response = await api.post('/events', data);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update event (admin only)
export const updateEvent = async (id: string, data: Partial<CreateEventData>): Promise<Event> => {
  try {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event (admin only)
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Toggle event visibility (admin only)
export const toggleEventVisibility = async (id: string, showEvent: boolean): Promise<Event> => {
  try {
    const response = await api.put(`/events/${id}`, { showEvent });
    return response.data;
  } catch (error) {
    console.error('Error toggling event visibility:', error);
    throw error;
  }
};
