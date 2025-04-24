const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot be more than 50 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  profilePicture: String,
  coverImage: String,
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    github: String,
    dribbble: String,
    behance: String
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'minimal'],
    default: 'minimal'
  },
  customCSS: String,
  published: {
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

PortfolioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);