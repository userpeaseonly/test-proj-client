# Task Management Client - Next.js 15

A comprehensive task management client application built with Next.js 15, featuring modern authentication, TypeScript, and shadcn/ui components.

## 🚀 Features

### ✅ Authentication System
- **JWT-based authentication** with access/refresh token pattern
- **HTTP-only cookie** support for refresh tokens
- **Auto token refresh** with seamless user experience
- **Protected routes** with loading states
- **Form validation** using Zod schemas
- **Modern UI** with shadcn/ui components
- **Responsive design** with Tailwind CSS

### � Task Management (NEW!)
- **Complete CRUD operations** for tasks
- **Real-time statistics** dashboard
- **Advanced filtering** by status, search, and sorting
- **Task status management** (completed/pending/toggle)
- **Responsive task cards** with action menus
- **Form validation** with error handling
- **Optimistic updates** for smooth UX
- **Delete confirmations** with alert dialogs

### �🛡️ Security
- Secure token storage (localStorage for access, HTTP-only cookies for refresh)
- Automatic token refresh on API calls
- Protected route middleware
- Input validation and sanitization

### 🎨 UI/UX
- **shadcn/ui** component library
- **Tailwind CSS v4** for styling
- **Lucide React** icons
- **Sonner** for toast notifications
- **Form validation** with react-hook-form
- **Loading states** and error handling
- **Responsive design** for all screen sizes

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── auth/
│   │   ├── auth-container.tsx    # Auth mode switcher
│   │   ├── login-form.tsx        # Login form component
│   │   ├── register-form.tsx     # Registration form
│   │   ├── protected-route.tsx   # Route protection HOC
│   │   ├── user-menu.tsx         # User menu with logout
│   │   └── index.ts              # Component exports
│   ├── tasks/                    # Task management components
│   │   ├── task-management.tsx   # Main task page container
│   │   ├── task-stats.tsx        # Statistics dashboard
│   │   ├── task-list.tsx         # Task list with items
│   │   ├── task-filters.tsx      # Search and filter controls
│   │   ├── create-task-dialog.tsx # Create task form
│   │   ├── edit-task-dialog.tsx  # Edit task form
│   │   └── index.ts              # Component exports
│   ├── debug/
│   │   └── api-test.tsx          # API connection tester
│   └── ui/                       # shadcn/ui components
├── context/
│   ├── auth-context.tsx    # Authentication context & hooks
│   └── task-context.tsx    # Task management context & hooks
├── lib/
│   ├── api/                # Modular API client structure
│   │   ├── index.ts        # Combined API client export
│   │   ├── base-client.ts  # Base HTTP client functionality
│   │   ├── auth-client.ts  # Authentication API calls
│   │   ├── task-client.ts  # Task management API calls
│   │   └── README.md       # API architecture documentation
│   ├── utils.ts            # Utility functions & constants
│   └── validations/
│       ├── auth.ts         # Auth validation schemas
│       └── task.ts         # Task validation schemas
└── types/
    ├── auth.ts             # Authentication TypeScript interfaces
    └── task.ts             # Task TypeScript interfaces
```

## 🔧 Technology Stack

- **Next.js 15.5.6** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **react-hook-form** - Performant form library
- **Zod** - TypeScript-first validation
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date formatting and manipulation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 🐳 Production Deployment

For production deployment using Docker:

1. **Configure production environment:**
```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

2. **Run production Docker Compose:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔐 Authentication Flow

### Login Process
1. User enters email/password
2. Form validation with Zod
3. API call to `/api/auth/login/`
4. Access token stored in localStorage
5. Refresh token set as HTTP-only cookie
6. User redirected to dashboard

### Auto-Refresh
1. API calls check token expiration
2. Automatic refresh using HTTP-only cookie
3. New access token updated seamlessly
4. Failed refresh redirects to login

### Logout Process
1. Call `/api/auth/logout/` endpoint
2. Clear access token from localStorage
3. Backend clears refresh token cookie
4. Redirect to login page

## 📋 API Integration

The client integrates with these backend endpoints:

### Authentication
- `POST /api/auth/login/` - User authentication
- `POST /api/auth/register/` - User registration  
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Token refresh
- `GET /api/auth/me/` - Current user profile

### Task Management
- `GET /api/tasks/` - List tasks with filtering/search/sorting
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update task (full)
- `PATCH /api/tasks/{id}/` - Update task (partial)
- `DELETE /api/tasks/{id}/` - Delete task
- `POST /api/tasks/{id}/complete/` - Mark as completed
- `POST /api/tasks/{id}/pending/` - Mark as pending
- `POST /api/tasks/{id}/toggle/` - Toggle completion status
- `GET /api/tasks/stats/` - Get task statistics

## 🔨 Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## 🎯 Key Features Implemented

### Authentication Context
- Centralized authentication state management
- Auto-loading user on app initialization
- Token refresh handling
- Type-safe auth operations

### Task Management System
- **TaskContext**: Centralized task state management
- **CRUD Operations**: Create, read, update, delete tasks
- **Status Management**: Complete/pending/toggle operations
- **Real-time Statistics**: Task counts and completion rates
- **Advanced Filtering**: Search, status filter, sorting options
- **Optimistic Updates**: Immediate UI feedback

### Form Components
- **LoginForm**: Email/password with validation
- **RegisterForm**: Full registration with name fields
- **CreateTaskDialog**: New task creation form
- **EditTaskDialog**: Task editing with pre-filled data
- **Password visibility toggle**
- **Loading states during submission**
- **Error handling with toast notifications**

### UI Components
- **TaskList**: Responsive task cards with actions
- **TaskStats**: Statistics dashboard with icons
- **TaskFilters**: Search, status, and sort controls
- **UserMenu**: Profile info and logout
- **ProtectedRoute HOC**: Wraps authenticated pages
- **Loading spinners**: Shows during operations
- **Confirmation dialogs**: For destructive actions

### API Client Architecture
- **Modular design**: Separate clients for auth and tasks
- **BaseApiClient**: Common HTTP functionality and token management
- **AuthApiClient**: Authentication operations (login, register, logout)
- **TaskApiClient**: Task management operations (CRUD, status, stats)
- **Unified interface**: Combined client using composition pattern
- **Automatic token sync**: Keeps all clients in sync
- **Error handling**: Centralized logging and error parsing
- **Type safety**: Full TypeScript support throughout

## 🚀 Next Steps

The complete task management system is now ready! You can:

1. **Test all CRUD operations** - Create, edit, delete tasks
2. **Use advanced filtering** - Search, status filter, sorting
3. **Monitor task statistics** - Completion rates and counts
4. **Integrate AI SDK v5** for smart task suggestions
5. **Add admin analytics** for user management
6. **Implement real-time updates** with WebSockets
7. **Add task categories/tags** for better organization
8. **Export task reports** in different formats

## 🎉 What's Working Now

### Complete Task Management Flow
1. **Dashboard** → View task statistics and overview
2. **Create Tasks** → Add new tasks with title/description
3. **Task List** → View all tasks with status indicators
4. **Edit Tasks** → Update task details inline
5. **Status Management** → Mark complete/pending/toggle
6. **Delete Tasks** → Remove with confirmation
7. **Advanced Filtering** → Search, filter by status, sort
8. **Real-time Stats** → Live completion rates and counts

### Authentication Integration
- **Seamless login/logout** flow
- **Protected task operations** with JWT tokens
- **Auto token refresh** during task operations
- **User profile** display in header

## 🛠️ Built With Best Practices

- **TypeScript strict mode** for type safety
- **React Server Components** by default
- **Client Components** only when needed
- **Early returns** for better readability
- **Descriptive naming conventions**
- **Proper accessibility** with ARIA labels
- **Responsive design** patterns
- **Error boundaries** and proper error handling

---

**Complete Task Management System Ready!** 🎉

The application now includes full authentication + comprehensive task management with all CRUD operations, statistics, filtering, and a modern, responsive UI. All components are working seamlessly with your Django backend APIs.