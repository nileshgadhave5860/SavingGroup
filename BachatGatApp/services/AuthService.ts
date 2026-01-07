/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface LoginRequest {
  phoneNumber: string;
  password: string;
  savingGroupId?: string;
  isMemberLogin?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    phoneNumber: string;
    name: string;
    email?: string;
    role: string;
  };
  savingGroup?: {
    id: string;
    name: string;
  };
}

export interface SignUpRequest {
  phoneNumber: string;
  password: string;
  name: string;
  email?: string;
}

export interface ForgotPasswordRequest {
  phoneNumber: string;
}

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      // Store auth token if login successful
      if (response.success && response.data?.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signUp(userData: SignUpRequest): Promise<APIResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/signup', userData);
      
      // Store auth token if signup successful
      if (response.success && response.data?.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<APIResponse> {
    try {
      return await apiService.post('/auth/forgot-password', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear auth token
      apiService.setAuthToken(null);
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<APIResponse> {
    try {
      return await apiService.post('/auth/verify-otp', { phoneNumber, otp });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(phoneNumber: string): Promise<APIResponse> {
    try {
      return await apiService.post('/auth/resend-otp', { phoneNumber });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<APIResponse> {
    try {
      return await apiService.get('/auth/me');
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();

export default authService;
