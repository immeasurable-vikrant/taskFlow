import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Todo, TodoFilters, PaginatedResponse } from '../types';
import { todoService } from '../services/todoService';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  addTodo: (title: string, description?: string) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  fetchTodos: () => Promise<void>;
  setFilters: (filters: TodoFilters) => void;
  setPage: (page: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, filters, pagination.page]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<Todo> = await todoService.getTodos({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setTodos(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, description?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTodo = await todoService.createTodo({ title, description });
      
      // Add to the beginning of the list if sorting by newest
      if (filters.sortBy === 'createdAt' && filters.sortOrder === 'desc') {
        setTodos([newTodo, ...todos]);
      } else {
        // Otherwise refresh the list to get the correct order
        await fetchTodos();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, data: Partial<Todo>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTodo = await todoService.updateTodo(id, data);
      
      setTodos(todos.map(todo => todo.userId === id ? updatedTodo : todo));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await todoService.deleteTodo(id);
      
      setTodos(todos.filter(todo => todo.userId !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.userId === id);
    if (!todo) return;
    
    try {
      await updateTodo(id, { completed: !todo.completed });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle todo status');
    }
  };

  const updateFilters = (newFilters: TodoFilters) => {
    // Reset to page 1 when changing filters
    setFilters(newFilters);
    setPagination({...pagination, page: 1});
  };

  const updatePage = (page: number) => {
    setPagination({...pagination, page});
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        filters,
        pagination,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        fetchTodos,
        setFilters: updateFilters,
        setPage: updatePage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};