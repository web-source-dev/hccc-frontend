import { getAuthHeaders } from './auth';

export interface Payment {
  _id: string;
  user: string;
  game: {
    _id: string;
    name: string;
    image: string;
  };
  tokenPackage: {
    tokens: number;
    price: number;
    name?: string;
  };
  location: string;
  paypalOrderId: string;
  paypalPayerId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'expired';
  paymentMethod?: string;
  receiptUrl?: string;
  // Token addition tracking
  tokensScheduledFor?: string;
  tokensAdded?: boolean;
  pendingTokens?: number;
  metadata: {
    gameName: string;
    userFirstname: string;
    userLastname: string;
    userEmail: string;
    timeRestriction?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  gameId: string;
  packageIndex: number;
  location: string;
}

export interface CaptureOrderData {
  orderId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create PayPal order
export const createOrder = async (data: CreateOrderData): Promise<{
  success: boolean;
  data: {
    orderId: string;
    paymentId: string;
  };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create PayPal order');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Capture PayPal order
export const captureOrder = async (data: CaptureOrderData): Promise<{
  success: boolean;
  data: {
    payment: Payment;
    status: string;
  };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/capture-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to capture PayPal order');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get user payments
export const getUserPayments = async (): Promise<{
  success: boolean;
  data: {
    payments: Payment[];
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/user-payments`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch payment history');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId: string): Promise<{
  success: boolean;
  data: {
    payment: Payment;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch payment details');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get payment details by PayPal order ID
export const getPaymentByOrder = async (orderId: string): Promise<{
  success: boolean;
  data: {
    payment: Payment;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/by-order/${orderId}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch payment details');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Get all payments (admin only)
export const getAllPayments = async (params?: {
  limit?: number;
  page?: number;
  status?: string;
  search?: string;
  game?: string;
  location?: string;
  tokens?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{
  success: boolean;
  data: {
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}> => {
  try {
    const token = getAuthHeaders().Authorization;
    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    console.log('Fetching all payments with token:', token.substring(0, 20) + '...');

    const response = await fetch(`${API_BASE_URL}/payments/admin/all?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch payments:', result);
      throw new Error(result.message || 'Failed to fetch payments');
    }

    console.log('Payments fetched successfully:', result.data.payments.length, 'payments');
    return result;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Get payment statistics (admin only)
export const getPaymentStats = async (): Promise<{
  success: boolean;
  data: {
    totalPayments: number;
    successfulPayments: number;
    pendingPayments: number;
    failedPayments: number;
    totalRevenue: number;
    recentPayments: number;
  };
}> => {
  try {
    const token = getAuthHeaders().Authorization;
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Fetching payment stats with token:', token.substring(0, 20) + '...');

    const response = await fetch(`${API_BASE_URL}/payments/admin/stats`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch payment stats:', result);
      throw new Error(result.message || 'Failed to fetch payment statistics');
    }

    console.log('Payment stats fetched successfully:', result.data);
    return result;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
}; 