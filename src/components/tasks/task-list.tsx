'use client';

import { useState } from 'react';
import { useTask } from '@/context/task-context';
import { TaskList as TaskListType } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: TaskListType;
  onEdit: (task: TaskListType) => void;
  onViewDetails: (task: TaskListType) => void;
}

const TaskItem = ({ task, onEdit, onViewDetails }: TaskItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toggleTaskStatus, deleteTask } = useTask();

  const handleToggleStatus = async () => {
    try {
      await toggleTaskStatus(task.id);
      toast.success(
        task.completed 
          ? 'Task marked as pending' 
          : 'Task marked as completed'
      );
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const timeAgo = formatDistanceToNow(new Date(task.updated_at), { addSuffix: true });

  return (
    <>
      <Card className={`transition-all hover:shadow-md ${task.completed ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto mt-1"
              onClick={handleToggleStatus}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            <div 
              className="flex-1 min-w-0 cursor-pointer" 
              onClick={() => onViewDetails(task)}
            >
              <div className="flex items-start justify-between">
                <h3 className={`font-medium text-sm hover:text-primary transition-colors ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {task.title}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(task)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={task.completed ? 'default' : 'secondary'}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {timeAgo}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface TaskListProps {
  onEditTask: (task: TaskListType) => void;
  onViewTaskDetails: (task: TaskListType) => void;
}

export const TaskList = ({ onEditTask, onViewTaskDetails }: TaskListProps) => {
  const { tasks, isLoading, error } = useTask();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onViewDetails={onViewTaskDetails}
        />
      ))}
    </div>
  );
};