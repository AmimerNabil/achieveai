const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.email }); // Filter by user's email
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task for the logged-in user
router.post('/', async (req, res) => {
    const task = new Task({
        ...req.body,
        email: req.user.email, // Associate task with user's email
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a specific task for the logged-in user
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.email }); // Match task ID and user's email
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Update a task for the logged-in user
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.email }, // Match task ID and user's email
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task time spent for the logged-in user
router.put('/:id/time', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.email }, // Match task ID and user's email
            { timeSpent: req.body.timeSpent },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task for the logged-in user
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.email }); // Match task ID and user's email
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

