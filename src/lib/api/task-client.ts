import { BaseApiClient } from './base-client';
import { apiEndpoints } from '@/lib/utils';
import {
  Task,
  TaskList,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskPatchRequest,
  TaskStats,
  TaskFilters
} from '@/types/task';

export class TaskApiClient extends BaseApiClient {
  getTasks = async (filters?: TaskFilters): Promise<TaskList[]> => {
    const params = new URLSearchParams();
    
    if (filters?.completed !== undefined) {
      params.append('completed', filters.completed.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.ordering) {
      params.append('ordering', filters.ordering);
    }

    const url = `${this.baseURL}${apiEndpoints.tasks.list}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<TaskList[]>(response);
  };

  createTask = async (task: TaskCreateRequest): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.create}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(task),
    });

    return this.handleResponse<Task>(response);
  };

  getTask = async (id: number): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.detail(id)}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Task>(response);
  };

  updateTask = async (id: number, task: TaskUpdateRequest): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.update(id)}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(task),
    });

    return this.handleResponse<Task>(response);
  };

  patchTask = async (id: number, task: TaskPatchRequest): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.patch(id)}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(task),
    });

    return this.handleResponse<Task>(response);
  };

  deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.delete(id)}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      await this.handleResponse(response);
    }
  };

  toggleTaskStatus = async (id: number): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.toggle(id)}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Task>(response);
  };

  markTaskAsCompleted = async (id: number): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.complete(id)}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Task>(response);
  };

  markTaskAsPending = async (id: number): Promise<Task> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.pending(id)}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Task>(response);
  };

  getTaskStats = async (): Promise<TaskStats> => {
    const response = await fetch(`${this.baseURL}${apiEndpoints.tasks.stats}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<TaskStats>(response);
  };
}