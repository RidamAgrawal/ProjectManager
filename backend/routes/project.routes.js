const express = require('express');
const router = express.Router();
const Project = require('../models/project.model');
const User = require('../models/user.model');

// CREATE project
router.post('/', async (req, res) => {
  try {
    const { name, status, description, user, startDate, endDate } = req.body;
    const project = new Project({
      name, status, description, user, startDate, endDate
    });
    const savedProject = await project.save();

    await User.findByIdAndUpdate(user, {
      $push: { project: savedProject._id }
    })
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('user', 'email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE project by ID
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE project by ID
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const user$=await User.findByIdAndUpdate(project.user, {
      $pull: { project: project._id }
    })
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//GET all projects for a given user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const projects = await Project.find({ user: userId })
      .populate('user', 'email');

    // if (projects.length === 0) {
    //   return res.status(404).json({ message: 'No projects found for this user.' });
    // }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects: ' + err.message });
  }
});

module.exports = router;