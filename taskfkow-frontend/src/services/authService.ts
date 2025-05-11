import api from './api';
import { AuthResponse, User } from '../types';
import axios from 'axios';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to login');
      }
      throw new Error('Network error, please try again');
    }
  },

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to signup');
      }
      throw new Error('Network error, please try again');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const res = await api.get<{ user: User }>('/auth/me');
      return res.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  async verifySession(): Promise<boolean> {
    try {
      // Lightweight endpoint that just verifies if the JWT cookie is valid
      // This could be called in situations where you need to verify the session
      const res = await api.get<{ valid: boolean }>('/auth/verify');
      return res.data.valid;
    } catch (error) {
      console.error('Session verification failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};