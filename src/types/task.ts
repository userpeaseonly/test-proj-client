export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface TaskList {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskUpdateRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskPatchRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
  ordering?: string;
}

export interface TaskContextType {
  tasks: TaskList[];
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  
  // CRUD operations
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskCreateRequest) => Promise<Task>;
  updateTask: (id: number, task: TaskUpdateRequest) => Promise<Task>;
  patchTask: (id: number, task: TaskPatchRequest) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  getTask: (id: number) => Promise<Task>;
  
  // Status operations
  toggleTaskStatus: (id: number) => Promise<Task>;
  markAsCompleted: (id: number) => Promise<Task>;
  markAsPending: (id: number) => Promise<Task>;
  
  // Stats
  fetchStats: () => Promise<void>;
  
  // Filters
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  
  // Cache management
  clearCache: () => void;
}