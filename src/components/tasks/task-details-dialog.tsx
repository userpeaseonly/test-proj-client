'use client';

import { useEffect, useState } from 'react';
import { useTask } from '@/context/task-context';
import { Task, TaskList } from '@/types/task';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  CheckCircle, 
  Circle, 
  Calendar,
  Clock,
  User,
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface TaskDetailsDialogProps {
  task: TaskList | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: TaskList) => void;
}

export const TaskDetailsDialog = ({ task, open, onOpenChange, onEdit }: TaskDetailsDialogProps) => {
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getTask, toggleTaskStatus } = useTask();

  // Load full task details when dialog opens
  useEffect(() => {
    const loadTaskDetails = async () => {
      if (!task || !open) {
        setTaskDetails(null);
        return;
      }
      
      setIsLoading(true);
      try {
        const fullTask = await getTask(task.id);
        setTaskDetails(fullTask);
      } catch (error) {
        toast.error('Failed to load task details');
        onOpenChange(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadTaskDetails();
  }, [task, open, getTask, onOpenChange]);

  const handleToggleStatus = async () => {
    if (!task) return;
    
    try {
      await toggleTaskStatus(task.id);
      toast.success(
        task.completed 
          ? 'Task marked as pending' 
          : 'Task marked as completed'
      );
      
      // Reload task details to get updated data
      const updatedTask = await getTask(task.id);
      setTaskDetails(updatedTask);
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleEdit = () => {
    if (task && onEdit) {
      onEdit(task);
      onOpenChange(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Task Details</span>
            <Badge variant={task.completed ? 'default' : 'secondary'}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            View and manage task information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading task details...</span>
          </div>
        ) : taskDetails ? (
          <div className="space-y-6">
            {/* Title and Status */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto mt-1"
                  onClick={handleToggleStatus}
                >
                  {taskDetails.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <h3 className={`text-lg font-semibold ${
                  taskDetails.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {taskDetails.title}
                </h3>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
              <div className="text-sm pl-6">
                {taskDetails.description ? (
                  <p className="whitespace-pre-wrap">{taskDetails.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">No description provided</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Metadata */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </div>
              
              <div className="pl-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(taskDetails.created_at), 'PPp')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(taskDetails.updated_at), 'PPp')}
                      <span className="text-muted-foreground ml-1">
                        ({formatDistanceToNow(new Date(taskDetails.updated_at), { addSuffix: true })})
                      </span>
                    </span>
                  </div>
                </div>

                {taskDetails.user && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by:</span>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{taskDetails.user}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <Separator />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleToggleStatus}
                >
                  Mark as {taskDetails.completed ? 'Pending' : 'Completed'}
                </Button>
                
                {onEdit && (
                  <Button onClick={handleEdit}>
                    Edit Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Failed to load task details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};