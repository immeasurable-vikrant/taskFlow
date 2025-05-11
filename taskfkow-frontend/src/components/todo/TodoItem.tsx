import React, { useState } from 'react';
import { Check, Trash, Edit, X, Save } from 'lucide-react';
import { Todo } from '../../types';
import { useTodo } from '../../context/TodoContext';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/format';

interface TodoItemProps {
	todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
	const { toggleComplete, deleteTodo, updateTodo } = useTodo();
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(todo?.title);
	console.log('todo', todo);
	const [editDescription, setEditDescription] = useState(
		todo?.description || ''
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const handleToggleComplete = () => {
		toggleComplete(todo?._id);
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await deleteTodo(todo?._id);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setEditTitle(todo?.title);
		setEditDescription(todo?.description || '');
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (editTitle.trim() === '') return;

		try {
			setIsSaving(true);
			await updateTodo(todo?._id, {
				title: editTitle,
				description: editDescription || undefined,
			});
			setIsEditing(false);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div
			className={`card mb-4 transition-all duration-250 ${
				isEditing ? 'ring-2 ring-primary-500' : ''
			}`}
		>
			{isEditing ? (
				<div className="animate-fadeIn">
					<input
						type="text"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						className="input mb-2"
						placeholder="Todo title"
					/>
					<textarea
						value={editDescription}
						onChange={(e) => setEditDescription(e.target.value)}
						className="input mb-4 min-h-[80px] resize-y"
						placeholder="Description (optional)"
					/>
					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleCancel}
							icon={<X className="w-4 h-4" />}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={handleSave}
							isLoading={isSaving}
							icon={<Save className="w-4 h-4" />}
							disabled={editTitle.trim() === ''}
						>
							Save
						</Button>
					</div>
				</div>
			) : (
				<div className="flex">
					<div className="mr-4 mt-1">
						<button
							className={`w-6 h-6 rounded-full border ${
								todo?.completed
									? 'bg-primary-500 border-primary-600 text-white'
									: 'border-gray-400 dark:border-gray-600'
							} flex items-center justify-center transition-colors duration-250`}
							onClick={handleToggleComplete}
						>
							{todo?.completed && <Check className="w-4 h-4" />}
						</button>
					</div>
					<div className="flex-1">
						<h3
							className={`text-lg font-medium ${
								todo?.completed
									? 'line-through text-gray-500 dark:text-gray-400'
									: 'text-gray-900 dark:text-white'
							}`}
						>
							{todo?.title}
						</h3>
						{todo?.description && (
							<p
								className={`mt-1 text-sm ${
									todo?.completed
										? 'text-gray-400 dark:text-gray-500'
										: 'text-gray-600 dark:text-gray-400'
								}`}
							>
								{todo?.description}
							</p>
						)}
						<p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
							Created {formatDate(todo?.createdAt)}
							{todo?.updatedAt !== todo?.createdAt &&
								` · Updated ${formatDate(todo?.updatedAt)}`}
						</p>
					</div>
					<div className="flex space-x-1 ml-2">
						<Button
							variant="secondary"
							size="sm"
							className="p-1.5"
							onClick={handleEdit}
							icon={<Edit className="w-4 h-4" />}
						/>
						<Button
							variant="danger"
							size="sm"
							className="p-1.5"
							onClick={handleDelete}
							isLoading={isDeleting}
							icon={<Trash className="w-4 h-4" />}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
