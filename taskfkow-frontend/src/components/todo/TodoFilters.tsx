import React from 'react';
import { Search, SlidersHorizontal, ArrowDownAZ, ArrowUpZA, Clock } from 'lucide-react';
import { TodoFilters } from '../../types';
import { Button } from '../ui/Button';

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
}

export const TodoFilterBar: React.FC<TodoFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  
  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFiltersChange, filters]);

  const handleStatusChange = (status: TodoFilters['status']) => {
    onFiltersChange({ ...filters, status });
  };
  
  const handleSortChange = (sortBy: TodoFilters['sortBy']) => {
    const sortOrder = 
      sortBy === filters.sortBy && filters.sortOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };
  
  const getSortIcon = (field: TodoFilters['sortBy']) => {
    if (filters.sortBy !== field) return null;
    
    return filters.sortOrder === 'asc' 
      ? <ArrowDownAZ className="w-4 h-4 ml-1" />
      : <ArrowUpZA className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={<SlidersHorizontal className="w-4 h-4" />}
        >
          Filters
        </Button>
      </div>
      
      {isExpanded && (
        <div className="card p-4 mb-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <label className="label">Status</label>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={filters.status === 'all' ? 'primary' : 'outline'}
                  onClick={() => handleStatusChange('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filters.status === 'active' ? 'primary' : 'outline'}
                  onClick={() => handleStatusChange('active')}
                >
                  Active
                </Button>
                <Button
                  size="sm"
                  variant={filters.status === 'completed' ? 'primary' : 'outline'}
                  onClick={() => handleStatusChange('completed')}
                >
                  Completed
                </Button>
              </div>
            </div>
            
            <div>
              <label className="label">Sort By</label>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={filters.sortBy === 'createdAt' ? 'primary' : 'outline'}
                  onClick={() => handleSortChange('createdAt')}
                  className="inline-flex items-center"
                >
                  Date {getSortIcon('createdAt')}
                </Button>
                <Button
                  size="sm"
                  variant={filters.sortBy === 'title' ? 'primary' : 'outline'}
                  onClick={() => handleSortChange('title')}
                  className="inline-flex items-center"
                >
                  Title {getSortIcon('title')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};