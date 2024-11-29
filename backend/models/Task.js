// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  dueDate: { type: Date },
  category: { type: String },
  repetition: { type: String, enum: ['None', 'Daily', 'Weekly'], default: 'None' },
  estimatedTime: { type: Number },
  isCompleted: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
