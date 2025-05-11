import React from 'react';
import { Todo } from '../../types';
import { TodoItem } from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, loading }) => {
  console.log("todos", todos)
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by adding a new task above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};