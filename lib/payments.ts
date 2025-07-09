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
  };
  location: string;
  stripePaymentIntentId: string;
  stripeClientSecret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'expired';
  paymentMethod?: string;
  receiptUrl?: string;
  metadata: {
    gameName: string;
    userName: string;
    userEmail: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentData {
  gameId: string;
  packageIndex: number;
  location: string;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create payment intent
export const createPaymentIntent = async (data: CreatePaymentIntentData): Promise<{
  success: boolean;
  data: {
    clientSecret: string;
    paymentId: string;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create payment intent');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Confirm payment
export const confirmPayment = async (data: ConfirmPaymentData): Promise<{
  success: boolean;
  data: {
    payment: Payment;
    status: string;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/confirm-payment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to confirm payment');
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

// Get all payments (admin only)
export const getAllPayments = async (params?: {
  limit?: number;
  page?: number;
  status?: string;
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
        if (value !== undefined) {
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