'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useCacheInvalidation } from '@/hooks/use-cache-invalidation';
import { useAuth } from './auth-context';
import { 
  TaskContextType,
  Task,
  TaskList,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskPatchRequest,
  TaskStats,
  TaskFilters
} from '@/types/task';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<TaskList[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
  const { subscribeToCacheInvalidation } = useCacheInvalidation();
  const { user, isAuthenticated } = useAuth();

  const clearError = () => setError(null);

  const fetchTasks = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!isAuthenticated || !user) {
      console.log('🚫 TaskContext: Not fetching tasks - user not authenticated');
      return;
    }

    setIsLoading(true);
    clearError();
    try {
      console.log(`📊 TaskContext: Fetching tasks for user ${user.id} with filters:`, filters);
      const tasksData = await apiClient.getTasks(filters);
      setTasks(tasksData);
      console.log(`✅ TaskContext: Fetched ${tasksData.length} tasks for user ${user.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isAuthenticated, user]);

  const fetchStats = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!isAuthenticated || !user) {
      console.log('🚫 TaskContext: Not fetching stats - user not authenticated');
      return;
    }

    clearError();
    try {
      console.log(`📊 TaskContext: Fetching stats for user ${user.id}`);
      const statsData = await apiClient.getTaskStats();
      setStats(statsData);
      console.log(`✅ TaskContext: Fetched stats for user ${user.id}:`, statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Failed to fetch stats:', err);
    }
  }, [isAuthenticated, user]);

  const createTask = async (task: TaskCreateRequest): Promise<Task> => {
    clearError();
    try {
      const newTask = await apiClient.createTask(task);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: number, task: TaskUpdateRequest): Promise<Task> => {
    clearError();
    try {
      const updatedTask = await apiClient.updateTask(id, task);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  };

  const patchTask = async (id: number, task: TaskPatchRequest): Promise<Task> => {
    clearError();
    try {
      const updatedTask = await apiClient.patchTask(id, task);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    clearError();
    try {
      await apiClient.deleteTask(id);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  };

  const getTask = async (id: number): Promise<Task> => {
    clearError();
    try {
      return await apiClient.getTask(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task';
      setError(errorMessage);
      throw err;
    }
  };

  const toggleTaskStatus = async (id: number): Promise<Task> => {
    clearError();
    try {
      const updatedTask = await apiClient.toggleTaskStatus(id);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task status';
      setError(errorMessage);
      throw err;
    }
  };

  const markAsCompleted = async (id: number): Promise<Task> => {
    clearError();
    try {
      const updatedTask = await apiClient.markTaskAsCompleted(id);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark task as completed';
      setError(errorMessage);
      throw err;
    }
  };

  const markAsPending = async (id: number): Promise<Task> => {
    clearError();
    try {
      const updatedTask = await apiClient.markTaskAsPending(id);
      await fetchTasks(); // Refresh the list
      await fetchStats(); // Refresh stats
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark task as pending';
      setError(errorMessage);
      throw err;
    }
  };

  const setFilters = (newFilters: TaskFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const clearCache = useCallback(() => {
    console.log('🧹 TaskContext: Clearing all cached data');
    setTasks([]);
    setStats(null);
    setError(null);
    setFiltersState({});
    setIsLoading(false);
  }, []);

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Subscribe to cache invalidation events
  useEffect(() => {
    const unsubscribe = subscribeToCacheInvalidation(() => {
      console.log('🧹 TaskContext: Cache invalidation triggered - clearing task data');
      clearCache();
    });

    return unsubscribe;
  }, [subscribeToCacheInvalidation, clearCache]);

  // Monitor user changes and clear cache when user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // User logged out or no user - clear cache
      if (currentUserId !== null) {
        console.log('👤 TaskContext: User logged out - clearing cache');
        clearCache();
        setCurrentUserId(null);
      }
      return;
    }

    // User logged in
    if (currentUserId !== user.id) {
      // Different user - clear cache and fetch fresh data
      if (currentUserId !== null) {
        console.log(`👤 TaskContext: User changed from ${currentUserId} to ${user.id} - clearing cache and fetching fresh data`);
        clearCache();
      }
      setCurrentUserId(user.id);
      
      // Add a small delay to ensure auth state is stable before fetching data
      const fetchTimeout = setTimeout(() => {
        console.log(`📊 TaskContext: Fetching fresh data for user ${user.id} after user change`);
        fetchTasks();
        fetchStats();
      }, 100);

      return () => clearTimeout(fetchTimeout);
    }
  }, [user, isAuthenticated, currentUserId, clearCache, fetchTasks, fetchStats]);

  const value: TaskContextType = {
    tasks,
    stats,
    isLoading,
    error,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    getTask,
    toggleTaskStatus,
    markAsCompleted,
    markAsPending,
    fetchStats,
    setFilters,
    clearFilters,
    clearCache,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};