export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Store token in localStorage
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Remove token from localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Get auth headers
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Login user
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    if (result.success && result.data.token) {
      setToken(result.data.token);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Signup user
export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    if (result.success && result.data.token) {
      setToken(result.data.token);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      removeToken();
      return null;
    }

    return result.data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    removeToken();
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  removeToken();
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Get all users (admin only)
export const getAllUsers = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
}): Promise<{
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/auth/users?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch users');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get user statistics (admin only)
export const getUserStats = async (): Promise<{
  success: boolean;
  data: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    newUsers: number;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/stats`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user statistics');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get current user's token balances
export const getUserTokenBalances = async (): Promise<{
  success: boolean;
  data: {
    balances: Array<{
      _id: string;
      user: string;
      game: {
        _id: string;
        name: string;
      };
      location: string;
      tokens: number;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me/tokens`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch token balances');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get token balances for a specific user (admin only)
export const getAdminUserTokenBalances = async (userId: string): Promise<{
  success: boolean;
  data: {
    balances: Array<{
      _id: string;
      user: string;
      game: {
        _id: string;
        name: string;
      };
      location: string;
      tokens: number;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}/tokens`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch token balances');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Adjust token balance for a user (admin only)
export const adjustUserTokenBalance = async (
  userId: string, 
  gameId: string, 
  location: string, 
  delta: number
): Promise<{
  success: boolean;
  data: {
    balance: {
      _id: string;
      user: string;
      game: string;
      location: string;
      tokens: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}/tokens/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ gameId, location, delta }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to adjust token balance');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (
  userId: string,
  data: {
    username?: string;
    email?: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
  }
): Promise<{
  success: boolean;
  data: {
    user: User;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update user');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete user');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Block/Unblock user (admin only)
export const blockUser = async (
  userId: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data: {
    user: User;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}/block`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update user status');
    }

    return result;
  } catch (error) {
    throw error;
  }
}; 