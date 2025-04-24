const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'link'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  caption: String,
  order: Number
});

const TimelineItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: Date,
  order: Number
});

const TechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: String
});

const OutcomeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['metric', 'testimonial'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const CaseStudySchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  projectOverview: {
    type: String,
    required: true,
    maxlength: [2000, 'Project overview cannot be more than 2000 characters']
  },
  mediaGallery: [MediaSchema],
  timeline: [TimelineItemSchema],
  technologies: [TechnologySchema],
  outcomes: [OutcomeSchema],
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
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

CaseStudySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);