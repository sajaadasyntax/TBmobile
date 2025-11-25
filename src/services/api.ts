import Constants from 'expo-constants';
import { getToken, setToken, setRefreshToken, setUser, clearAuth } from './storage';
import { config } from '../../config';

// Get API URL from config (prioritize expo config, then local config file)
const API_URL = Constants.expoConfig?.extra?.apiUrl || config.apiUrl;

console.log('Mobile API URL configured:', API_URL);

// Types matching the backend
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'CONTRACTOR' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
  contractor?: Contractor;
}

export interface Contractor {
  id: string;
  userId: string;
  businessName?: string;
  description?: string;
  status: string;
  tier: string;
  creditsBalance: number;
  weeklyCreditsLimit: number;
  jobsCompleted: number;
  averageRating: number;
  reviewCount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface ApiError {
  status: string;
  message: string;
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: 'error',
        message: data.message || 'An error occurred',
        statusCode: response.status,
      };
    }

    return data;
  } catch (error: any) {
    if (error.statusCode === 401) {
      // Token expired or invalid - clear auth
      await clearAuth();
    }
    throw error;
  }
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  try {
    const response = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token and user data
    await setToken(response.token);
    await setUser(response.data.user);

    // Check if user is a contractor
    if (response.data.user.role !== 'CONTRACTOR') {
      await clearAuth();
      throw {
        status: 'error',
        message: 'This app is only available for contractors. Please use the web app.',
      };
    }

    return {
      user: response.data.user,
      token: response.token,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if API call fails, clear local auth
    console.error('Logout API error:', error);
  } finally {
    await clearAuth();
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<string> {
  try {
    const response = await apiRequest<{ data: { token: string } }>('/api/auth/refresh', {
      method: 'POST',
    });

    const newToken = response.data.token;
    await setToken(newToken);
    return newToken;
  } catch (error) {
    await clearAuth();
    throw error;
  }
}

/**
 * Get current user profile
 */
export async function getMe(): Promise<User> {
  try {
    const response = await apiRequest<{ data: { user: User } }>('/api/users/me');
    await setUser(response.data.user);
    return response.data.user;
  } catch (error) {
    throw error;
  }
}

/**
 * Test API connectivity
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Handle API errors and return user-friendly message
 */
export function getErrorMessage(error: any): string {
  if (error.message) {
    return error.message;
  }
  if (error.statusCode === 401) {
    return 'Invalid email or password';
  }
  if (error.statusCode === 403) {
    return 'Access denied';
  }
  if (error.statusCode === 404) {
    return 'Resource not found';
  }
  if (error.statusCode === 500) {
    return 'Server error. Please try again later.';
  }
  if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
    return 'Network error. Please check your internet connection.';
  }
  return 'An unexpected error occurred';
}

