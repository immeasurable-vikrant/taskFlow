import api from './api';
import { Todo, TodoFilters, PaginatedResponse } from '../types';

export const todoService = {
  // Get todos with filtering, pagination and sorting
  async getTodos(params: TodoFilters & { page: number; limit: number }): Promise<PaginatedResponse<Todo>> {
    try {
      // Convert filter params for API
      const apiParams: Record<string, string | number> = { 
        page: params.page, 
        limit: params.limit 
      };
      
      if (params.search) apiParams.search = params.search;
      if (params.sortBy) apiParams.sortBy = params.sortBy;
      if (params.sortOrder) apiParams.sortOrder = params.sortOrder;
      if (params.status && params.status !== 'all') {
        apiParams.completed = params.status === 'completed' ? 'true' : 'false';
      }
      
      const response = await api.get<PaginatedResponse<Todo>>('/todos', { params: apiParams });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch todos');
      }
      throw new Error('Network error, please try again');
    }
  },

  // Create a new todo
  async createTodo(data: { title: string; description?: string }): Promise<Todo> {
    try {
      const response = await api.post<Todo>('/todo', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create todo');
      }
      throw new Error('Network error, please try again');
    }
  },

  // Update a todo
  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    try {
      const response = await api.patch<Todo>(`/todo/edit/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update todo');
      }
      throw new Error('Network error, please try again');
    }
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      await api.delete(`/todo/delete/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete todo');
      }
      throw new Error('Network error, please try again');
    }
  },
};

import axios from 'axios';