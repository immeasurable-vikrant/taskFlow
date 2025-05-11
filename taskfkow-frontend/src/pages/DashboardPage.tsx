import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { TodoForm } from '../components/todo/TodoForm';
import { TodoFilterBar } from '../components/todo/TodoFilters';
import { TodoList } from '../components/todo/TodoList';
import { TodoPagination } from '../components/todo/TodoPagination';
import { useTodo } from '../context/TodoContext';
import { Alert } from '../components/ui/Alert';

export const DashboardPage: React.FC = () => {
  const { 
    todos, 
    loading, 
    error, 
    filters, 
    pagination, 
    setFilters, 
    setPage,
    fetchTodos
  } = useTodo();

  useEffect(() => {
    fetchTodos();
  }, []);

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <PageLayout title="My Tasks" subtitle="Manage and organize your tasks efficiently">
      {error && (
        <Alert
          variant="error"
          message={error}
          className="mb-6"
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TodoFilterBar
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <TodoList
            todos={todos}
            loading={loading}
          />
          
          <TodoPagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
        
        <div className="lg:col-span-1 order-1 lg:order-2">
          <TodoForm />
          
          <div className="card">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Task Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total tasks</span>
                <span className="text-lg font-medium">{pagination.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="text-lg font-medium text-success-700 dark:text-success-500">
                  {todos.filter(todo => todo.completed).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
                <span className="text-lg font-medium text-warning-700 dark:text-warning-500">
                  {todos.filter(todo => !todo.completed).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};