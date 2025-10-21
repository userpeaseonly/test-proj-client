'use client';

import { useTask } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, BarChart3, Target } from 'lucide-react';

export const TaskStats = () => {
  const { stats, isLoading } = useTask();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: Target,
      color: 'default' as const,
    },
    {
      title: 'Completed',
      value: stats.completed_tasks,
      icon: CheckCircle,
      color: 'default' as const,
    },
    {
      title: 'Pending',
      value: stats.pending_tasks,
      icon: Clock,
      color: 'secondary' as const,
    },
    {
      title: 'Completion Rate',
      value: `${(stats.completion_rate).toFixed(1)}%`,
      icon: BarChart3,
      color: stats.completion_rate >= 0.7 ? ('default' as const) : ('destructive' as const),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.title === 'Completion Rate' && (
                <Badge variant={stat.color}>
                  {stats.completion_rate >= 0.7 ? 'Good' : 'Needs Work'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};