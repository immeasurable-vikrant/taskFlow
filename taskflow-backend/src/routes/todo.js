const express = require('express');
const { Todo } = require('../models/todo');
const mongoose = require('mongoose');
const { userAuth } = require('../middlewares/userAuth');
const todoRouter = express.Router();

// Create a new todo
todoRouter.post('/todo', userAuth, async (req, res) => {
	try {
		const { title, description } = req.body;
		const todoBody = { title, description, userId: req.user._id };

		const todoData = new Todo(todoBody);
		await todoData.save();
		res.send(todoData);
	} catch (err) {
		console.log('ERROR: ', err.message);
		res.status(400).json({ message: err.message, data: err.message });
	}
});

// Get todos with filtering, pagination and sorting
todoRouter.get('/todos', userAuth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		limit = limit > 50 ? 50 : limit;
		const skip = (page - 1) * limit;

		const user = req.user;
		const todos = await Todo.find({ userId: user._id }).skip(skip).limit(limit);
		if (!todos.length) {
			return res.status(400).send('No tasks found!');
		}

		res.json({
			message: 'Todos fetched successfully',
			data: todos,
			total: await Todo.countDocuments({ _id: req.user._id }),
			page,
			limit,
		});
	} catch (err) {
		console.log('ERROR: ', err.message);
		res.status(400).send(err.message);
	}
});

// Update a todo
todoRouter.patch('/todo/edit/:id', userAuth, async (req, res) => {
	try {
		const todoId = req.params.id;

		// Ensure the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(todoId)) {
			return res.status(400).json({ message: 'Invalid Todo ID' });
		}

		// Find the todo by its ID and ensure it belongs to the authenticated user
		const todoData = await Todo.findOne({ _id: todoId, userId: req.user._id });
		if (!todoData) {
			return res
				.status(404)
				.json({ message: 'Todo not found or unauthorized' });
		}

		// Update the fields provided in the request body
		Object.keys(req.body).forEach((field) => {
			todoData[field] = req.body[field];
		});

		// Save the updated todo
		await todoData.save();
		res.json({ message: 'Task updated successfully', data: todoData });
	} catch (err) {
		console.log('ERROR: ', err.message);
		res.status(400).json({ message: err.message });
	}
});

// Delete a todo
todoRouter.delete('/todo/delete/:id', userAuth, async (req, res) => {
	try {
		const todoId = req.params.id;

		// Validate ID
		if (!mongoose.Types.ObjectId.isValid(todoId)) {
			return res.status(400).json({ message: 'Invalid Todo ID' });
		}

		// Attempt to delete
		const result = await Todo.deleteOne({
			_id: todoId,
			userId: req.user._id,
		});
		// Check if a todo was actually deleted
		if (result.deletedCount === 0) {
			return res.status(400).json({ message: 'Todo not found or unauthorized' });
		}

		res.json({ message: 'Task deleted successfully!' });
	} catch (err) {
		console.log('ERROR: ', err.message);
		res.status(400).json({ message: err.message });
	}
});


module.exports = { todoRouter };
