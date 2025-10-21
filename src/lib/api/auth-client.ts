import { BaseApiClient } from './base-client';
import { apiEndpoints } from '@/lib/utils';
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User, 
  RefreshResponse 
} from '@/types/auth';

export class AuthApiClient extends BaseApiClient {
  login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('Attempting login to:', `${this.baseURL}${apiEndpoints.auth.login}`);
    
    const response = await fetch(`${this.baseURL}${apiEndpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies for refresh token
    });

    const data = await this.handleResponse<LoginResponse>(response);
    // Note: Don't set token here - let the main ApiClient handle it
    return data;
  };

  register = async (userData: RegisterRequest): Promise<User> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.auth.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    return this.handleResponse<User>(response);
  };

  logout = async (): Promise<{ message: string }> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.auth.logout}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    const result = await this.handleResponse<{ message: string }>(response);
    // Note: Don't clear token here - let the main ApiClient handle it
    return result;
  };

  refreshToken = async (): Promise<RefreshResponse> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.auth.refresh}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include',
    });

    const data = await this.handleResponse<RefreshResponse>(response);
    // Note: Don't set token here - let the main ApiClient handle it
    return data;
  };

  getCurrentUser = async (): Promise<User> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.auth.me}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<User>(response);
  };
}