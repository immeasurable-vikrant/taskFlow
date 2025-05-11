import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useTodo } from '../../context/TodoContext';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TodoFormValues = z.infer<typeof todoSchema>;

export const TodoForm: React.FC = () => {
  const { addTodo } = useTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: TodoFormValues) => {
    try {
      await addTodo(data.title, data.description);
      reset();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register('title')}
        />
        <Textarea
          label="Description (optional)"
          placeholder="Add details or notes..."
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};