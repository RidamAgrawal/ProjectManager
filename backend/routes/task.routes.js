const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const Project = require('../models/task.model');

// CREATE task
router.post('/', async (req, res) => {
    try {
        const { title, assignee, status, priority, dueDate, project } = req.body;
        
        const task = new Task({
            title, assignee, status, priority, dueDate, project
        });
        
        const savedTask = await task.save();
        
        const project$=await Project.findByIdAndUpdate(project, {
            $push: { task: savedTask._id }
        });
        
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all task
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET all tasks for a given task
router.get('/project/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        const tasks = await Task.find({ project: projectId })
            .populate('assignee', 'name');
        // if (tasks.length === 0) {
        //   return res.status(404).json({ message: 'No tasks found for this task.' });
        // }
        
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks: ' + err.message });
    }
});

//GET task with given id
router.get('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findOne({ _id: taskId })
            .populate('assignee', 'name');
        if (!task) {
            return res.status(404).json({ message: 'No tasks found for this task.' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks: ' + err.message });
    }
});

//DELETE a task with given id
router.delete('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findOneAndDelete({ _id: taskId })

        if (!task) {
            return res.status(404).json({ message: 'No task found with given id.' });
        }
        await Project.findByIdAndUpdate(task.project,{
            $pull: {task:task._id}
        })
        
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task: ' + err.message });
    }
});

// CREATE task for a given project
router.post('/:projectId', async (req, res) => {
    try {
        const projectId=req.params.projectId;
        
        const { title, assignee, status, priority, dueDate  } = req.body;
        const task = new Task({
            title, assignee, status, priority, dueDate, task ,project:projectId
        });
        const savedTask = await task.save();

        await Project.findByIdAndUpdate(projectId, {
            $push: { task: savedTask._id }
        });
        
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//UPDATE a task with given id
router.put('/:taskId', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
            new: true,
            runValidators: true,
        });
        
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task: ' + err.message });
    }
})

module.exports = router;