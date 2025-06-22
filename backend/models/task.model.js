const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'mild', 'medium', 'high', 'vhigh', 'urgent'],
    default: 'medium'
  },
  dueDate: { type: { year: Number, month: Number, day: Number } },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema, 'Task');