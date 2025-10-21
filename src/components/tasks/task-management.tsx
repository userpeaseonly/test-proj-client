'use client';

import { useState } from 'react';
import { TaskList as TaskListType } from '@/types/task';
import { TaskProvider } from '@/context/task-context';
import { TaskStats } from './task-stats';
import { TaskFilters } from './task-filters';
import { TaskList } from './task-list';
import { CreateTaskDialog } from './create-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';
import { TaskDetailsDialog } from './task-details-dialog';

const TaskManagementContent = () => {
  const [editingTask, setEditingTask] = useState<TaskListType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<TaskListType | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleEditTask = (task: TaskListType) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleViewTaskDetails = (task: TaskListType) => {
    setViewingTask(task);
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setViewingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <TaskStats />

      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your tasks efficiently
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Task List */}
      <TaskList 
        onEditTask={handleEditTask} 
        onViewTaskDetails={handleViewTaskDetails} 
      />

      {/* Edit Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Details Dialog */}
      <TaskDetailsDialog
        task={viewingTask}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onEdit={handleEditTask}
      />
    </div>
  );
};

export const TaskManagement = () => {
  return (
    <TaskProvider>
      <TaskManagementContent />
    </TaskProvider>
  );
};