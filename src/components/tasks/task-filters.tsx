'use client';

import { useState } from 'react';
import { useTask } from '@/context/task-context';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const TaskFilters = () => {
  const { filters, setFilters, clearFilters } = useTask();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput.trim() || undefined });
  };

  const handleCompletedFilter = (value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters.completed;
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, completed: value === 'completed' });
    }
  };

  const handleOrderingChange = (value: string) => {
    if (value === 'none') {
      const newFilters = { ...filters };
      delete newFilters.ordering;
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, ordering: value });
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
  };

  const hasActiveFilters = 
    filters.search || 
    filters.completed !== undefined || 
    filters.ordering;

  const getCompletedFilterValue = () => {
    if (filters.completed === true) return 'completed';
    if (filters.completed === false) return 'pending';
    return 'all';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Status Filter */}
        <Select value={getCompletedFilterValue()} onValueChange={handleCompletedFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Ordering */}
        <Select value={filters.ordering || 'none'} onValueChange={handleOrderingChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="created_at">Oldest First</SelectItem>
            <SelectItem value="-created_at">Newest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="-title">Title Z-A</SelectItem>
            <SelectItem value="updated_at">Last Updated (Old)</SelectItem>
            <SelectItem value="-updated_at">Last Updated (New)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Search className="h-3 w-3" />
              <span>Search: "{filters.search}"</span>
              <button
                onClick={() => {
                  setSearchInput('');
                  const newFilters = { ...filters };
                  delete newFilters.search;
                  setFilters(newFilters);
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.completed !== undefined && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Filter className="h-3 w-3" />
              <span>{filters.completed ? 'Completed' : 'Pending'}</span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.completed;
                  setFilters(newFilters);
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.ordering && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Filter className="h-3 w-3" />
              <span>Sorted</span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.ordering;
                  setFilters(newFilters);
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};