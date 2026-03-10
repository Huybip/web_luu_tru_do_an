const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Publish project
// @route   PUT /api/projects/:id/publish
// @access  Private
router.put('/:id/publish', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to publish this project'
      });
    }

    project.isPublished = true;
    project.publishedData = {
      ...req.body,
      publishDate: Date.now()
    };

    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router; 