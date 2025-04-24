const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'link'],
    required: false
  },
  url: {
    type: String,
    required: false
  },
  caption: String,
  order: Number
});

const TimelineItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  description: String,
  date: Date,
  order: Number
});

const TechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  icon: String
});

const OutcomeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['metric', 'testimonial'],
    required: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
});

const CaseStudySchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: false
  },
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: false,
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