'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useCacheInvalidation } from '@/hooks/use-cache-invalidation';
import { 
  AuthContextType, 
  User, 
  LoginRequest, 
  RegisterRequest 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { invalidateCache } = useCacheInvalidation();

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await apiClient.refreshToken();
      return response.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      return null;
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      const currentUserId = user?.id;
      const newUserId = userData.id;
      
      // If user has changed (different ID), invalidate cache
      if (currentUserId && currentUserId !== newUserId) {
        console.log('User changed - invalidating cache');
        invalidateCache();
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Try to refresh token if user fetch fails
      const newToken = await refreshToken();
      if (newToken) {
        try {
          const userData = await apiClient.getCurrentUser();
          const currentUserId = user?.id;
          const newUserId = userData.id;
          
          // If user has changed (different ID), invalidate cache
          if (currentUserId && currentUserId !== newUserId) {
            console.log('User changed after refresh - invalidating cache');
            invalidateCache();
          }
          
          setUser(userData);
        } catch (retryError) {
          console.error('Failed to load user after token refresh:', retryError);
          setUser(null);
          invalidateCache();
        }
      } else {
        setUser(null);
        invalidateCache();
      }
    }
  }, [refreshToken, user?.id, invalidateCache]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('🔐 AuthContext: Starting login process');
      
      // Clear any existing cache before login
      invalidateCache();
      
      const response = await apiClient.login(credentials);
      
      console.log(`✅ AuthContext: Login successful for user ${response.user.id}`);
      
      // Verify token was set properly
      const hasToken = apiClient.getTokenStatus();
      console.log('🔍 AuthContext: Token status after login:', hasToken);
      
      setUser(response.user);
      
      // Add a delay to ensure token propagation, then trigger fresh data fetch
      setTimeout(() => {
        console.log('🔄 AuthContext: Triggering cache invalidation and fresh data fetch');
        invalidateCache();
      }, 100);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      // Clear any existing cache before registration
      invalidateCache();
      
      await apiClient.register(userData);
      // After registration, log the user in (login already handles cache invalidation)
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('🚪 AuthContext: Starting logout process');
      
      // Clear cache before logout
      invalidateCache();
      
      await apiClient.logout();
      
      console.log('✅ AuthContext: Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      
      // Clear all cached data when user logs out
      console.log('🧹 AuthContext: Final cache clear after logout');
      invalidateCache();
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await loadUser();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [loadUser]);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    refreshToken,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};