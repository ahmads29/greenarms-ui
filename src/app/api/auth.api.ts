import client from './client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LogoutRequest, SendOtpRequest, VerifyOtpRequest, VerifyOtpResponse } from '@/app/types/api/Auth.types';
import axios from 'axios';

// Auth API endpoints

/**
 * Login user
 * Real endpoint: POST /auth/login/
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await client.post<LoginResponse>('/auth/login/', data);
    
    // Store tokens
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid request");
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      }
    }
    throw new Error("Login failed");
  }
};

/**
 * Send OTP for registration
 * Real endpoint: POST /auth/send-otp/
 */
export const sendOtp = async (email: string): Promise<void> => {
  try {
    const data: SendOtpRequest = { email };
    await client.post('/auth/register/initiate/', data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Validation Error or User Already Exists");
      }
      if (error.response?.status === 500) {
        throw new Error("Email Sending Failed");
      }
    }
    throw new Error("Failed to send OTP");
  }
};

/**
 * Verify OTP
 * Real endpoint: POST /auth/verify-otp/
 */
export const verifyOtp = async (email: string, otp_code: string): Promise<VerifyOtpResponse> => {
  try {
    const data: VerifyOtpRequest = { email, otp_code };
    const response = await client.post<VerifyOtpResponse>('/auth/register/verify/', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid OTP or Expired");
      }
      if (error.response?.status === 404) {
        throw new Error("No Pending Registration");
      }
    }
    throw new Error("Failed to verify OTP");
  }
};

/**
 * Register new user (Final step)
 * Real endpoint: POST /auth/register/complete/
 */
export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await client.post<RegisterResponse>('/auth/register/complete/', data);
    
    // Store tokens
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Validation Error or Invalid Token");
      }
      if (error.response?.status === 500) {
        throw new Error("Server Error");
      }
    }
    throw new Error("Registration failed");
  }
};

/**
 * Legacy Register function (deprecated, use registerUser)
 */
export const register = async (data: any): Promise<any> => {
  throw new Error("Use registerUser instead");
};

/**
 * Verify email token (deprecated, part of old flow)
 */
export const verifyEmail = async (token: string): Promise<void> => {
  throw new Error("Use verifyOtp instead");
};

/**
 * Logout user
 * Real endpoint: POST /auth/logout/
 */
export const logout = async (data: LogoutRequest): Promise<void> => {
  try {
    await client.post('/auth/logout/', data);
    
    // Remove tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid logout request");
      }
      if (error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
    }
    throw new Error("Logout failed");
  }
};
