# API Client Architecture

The API client has been refactored into smaller, modular files for better maintainability and separation of concerns.

## Structure

```
src/lib/api/
├── index.ts           # Main API client export
├── base-client.ts     # Base HTTP client with common functionality
├── auth-client.ts     # Authentication-related API calls
└── task-client.ts     # Task management API calls
```

## Components

### BaseApiClient (`base-client.ts`)
- **Purpose**: Provides common HTTP functionality
- **Features**:
  - Token management (localStorage)
  - Request header handling
  - Response parsing and error handling
  - Logging for debugging

### AuthApiClient (`auth-client.ts`)
- **Purpose**: Handles all authentication endpoints
- **Methods**:
  - `login(credentials)` - User authentication
  - `register(userData)` - User registration
  - `logout()` - User logout
  - `refreshToken()` - Token refresh
  - `getCurrentUser()` - Get user profile

### TaskApiClient (`task-client.ts`)
- **Purpose**: Handles all task management endpoints
- **Methods**:
  - `getTasks(filters?)` - List tasks with filtering
  - `createTask(task)` - Create new task
  - `getTask(id)` - Get task details
  - `updateTask(id, task)` - Full task update
  - `patchTask(id, task)` - Partial task update
  - `deleteTask(id)` - Delete task
  - `toggleTaskStatus(id)` - Toggle completion
  - `markTaskAsCompleted(id)` - Mark as completed
  - `markTaskAsPending(id)` - Mark as pending
  - `getTaskStats()` - Get statistics

### Combined ApiClient (`index.ts`)
- **Purpose**: Provides a unified interface using composition
- **Features**:
  - Combines all API clients into one interface
  - Manages token synchronization across clients
  - Maintains backward compatibility
  - Type-safe method forwarding

## Usage

```typescript
import { apiClient } from '@/lib/api';

// Authentication
await apiClient.login({ email, password });
const user = await apiClient.getCurrentUser();

// Tasks
const tasks = await apiClient.getTasks({ completed: false });
const newTask = await apiClient.createTask({ title: 'New Task' });
await apiClient.toggleTaskStatus(taskId);
```

## Benefits

1. **Separation of Concerns**: Each client handles its own domain
2. **Maintainability**: Smaller, focused files are easier to maintain
3. **Testability**: Individual clients can be tested in isolation
4. **Reusability**: Base client can be extended for new endpoints
5. **Type Safety**: Full TypeScript support throughout
6. **Debugging**: Centralized logging and error handling

## Token Management

The combined client automatically synchronizes access tokens across all sub-clients:

```typescript
apiClient.setAccessToken(token); // Updates both auth and task clients
```

This ensures that authentication state is consistent across all API calls.