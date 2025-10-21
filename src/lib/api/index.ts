import { API_BASE_URL } from '@/lib/utils';
import { AuthApiClient } from './auth-client';
import { TaskApiClient } from './task-client';
import { BaseApiClient } from './base-client';

// Combined API client using composition
class ApiClient {
  private auth: AuthApiClient;
  private taskClient: TaskApiClient;

  constructor() {
    this.auth = new AuthApiClient(API_BASE_URL);
    this.taskClient = new TaskApiClient(API_BASE_URL);
    
    // Ensure token is synchronized across all clients on initialization
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        console.log('🔑 ApiClient: Synchronizing token from localStorage across all clients');
        this.setAccessToken(token);
      }
    }
  }

  // Auth methods
  login = async (...args: Parameters<AuthApiClient['login']>) => {
    const result = await this.auth.login(...args);
    // Set token for both clients
    this.setAccessToken(result.access);
    return result;
  };
  
  register = async (...args: Parameters<AuthApiClient['register']>) => this.auth.register(...args);
  
  logout = async (...args: Parameters<AuthApiClient['logout']>) => {
    const result = await this.auth.logout(...args);
    // Clear token for both clients
    this.setAccessToken(null);
    return result;
  };
  
  refreshToken = async (...args: Parameters<AuthApiClient['refreshToken']>) => {
    const result = await this.auth.refreshToken(...args);
    // Set token for both clients
    this.setAccessToken(result.access);
    return result;
  };
  
  getCurrentUser = async (...args: Parameters<AuthApiClient['getCurrentUser']>) => this.auth.getCurrentUser(...args);

  // Task methods
  getTasks = async (...args: Parameters<TaskApiClient['getTasks']>) => this.taskClient.getTasks(...args);
  createTask = async (...args: Parameters<TaskApiClient['createTask']>) => this.taskClient.createTask(...args);
  getTask = async (...args: Parameters<TaskApiClient['getTask']>) => this.taskClient.getTask(...args);
  updateTask = async (...args: Parameters<TaskApiClient['updateTask']>) => this.taskClient.updateTask(...args);
  patchTask = async (...args: Parameters<TaskApiClient['patchTask']>) => this.taskClient.patchTask(...args);
  deleteTask = async (...args: Parameters<TaskApiClient['deleteTask']>) => this.taskClient.deleteTask(...args);
  toggleTaskStatus = async (...args: Parameters<TaskApiClient['toggleTaskStatus']>) => this.taskClient.toggleTaskStatus(...args);
  markTaskAsCompleted = async (...args: Parameters<TaskApiClient['markTaskAsCompleted']>) => this.taskClient.markTaskAsCompleted(...args);
  markTaskAsPending = async (...args: Parameters<TaskApiClient['markTaskAsPending']>) => this.taskClient.markTaskAsPending(...args);
  getTaskStats = async (...args: Parameters<TaskApiClient['getTaskStats']>) => this.taskClient.getTaskStats(...args);

  // Token management for both clients
  setAccessToken = (token: string | null) => {
    console.log('🔑 ApiClient: Setting access token for both clients:', token ? '***token***' : 'null');
    this.auth.setAccessToken(token);
    this.taskClient.setAccessToken(token);
  };

  // Debug method to check token status
  getTokenStatus = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    console.log('🔍 ApiClient token status:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      localStorage: token ? '***exists***' : 'null'
    });
    return !!token;
  };
}

export const apiClient = new ApiClient();

// Re-export for backwards compatibility
export { AuthApiClient, TaskApiClient, BaseApiClient };