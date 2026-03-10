const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'submitted'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedData: {
    category: String,
    technologies: [String],
    githubLink: String,
    demoLink: String,
    publishDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema); 