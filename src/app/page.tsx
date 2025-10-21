'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserMenu } from '@/components/auth/user-menu';
import { TaskManagement } from '@/components/tasks';

const DashboardContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <UserMenu />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <TaskManagement />
      </main>
    </div>
  );
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
