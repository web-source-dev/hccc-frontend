import { getAuthHeaders } from './auth';

export interface Game {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: 'RPG' | 'Action' | 'Sci-Fi' | 'Adventure' | 'Strategy' | 'Puzzle' | 'Racing' | 'Sports' | 'Other';
  status: 'active' | 'inactive' | 'maintenance';
  locations: Array<{
    name: string;
    available: boolean
  }>;
  tokenPackages: Array<{
    tokens: number;
    price: number;
  }>;
  featured: boolean;
  totalSales: number;
  createdBy: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameData {
  name: string;
  description: string;
  image: string;
  category: Game['category'];
  status?: Game['status'];
  locations: Array<{
    name: string;
    available?: boolean;
  }>;
  tokenPackages: Array<{
    tokens: number;
    price: number;
  }>;
  featured?: boolean;
}

export interface UpdateGameData extends Partial<CreateGameData> {
  _id: string;
}

export interface GamesResponse {
  success: boolean;
  message: string;
  data: {
    games: Game[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface GameResponse {
  success: boolean;
  message: string;
  data: {
    game: Game;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get all games
export const getGames = async (params?: {
  status?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<GamesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/games?${queryParams}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch games');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get game by ID
export const getGame = async (id: string): Promise<GameResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch game');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Create new game (admin only)
export const createGame = async (data: CreateGameData): Promise<GameResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create game');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Update game (admin only)
export const updateGame = async (data: UpdateGameData): Promise<GameResponse> => {
  try {
    const { _id, ...updateData } = data;
    const response = await fetch(`${API_BASE_URL}/games/${_id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update game');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Delete game (admin only)
export const deleteGame = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete game');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Game categories
export const GAME_CATEGORIES = [
  'RPG',
  'Action',
  'Sci-Fi',
  'Adventure',
  'Strategy',
  'Puzzle',
  'Racing',
  'Sports',
  'Other'
] as const;

// Game statuses
export const GAME_STATUSES = [
  'active',
  'inactive',
  'maintenance'
] as const;

// Default token packages
export const DEFAULT_TOKEN_PACKAGES = [
  { tokens: 10, price: 10 },
  { tokens: 20, price: 19 },
  { tokens: 50, price: 45 },
  { tokens: 100, price: 90 },
];

// Default locations
export const DEFAULT_LOCATIONS = [
  { name: 'Cedar Park', available: true },
  { name: 'Liberty Hill', available: true },
]; 