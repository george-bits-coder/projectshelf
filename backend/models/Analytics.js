const mongoose = require('mongoose');

const VisitorDataSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  referrer: String,
  country: String,
  city: String
});

const ClickEventSchema = new mongoose.Schema({
  element: String,
  count: Number
});

const AnalyticsSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  caseStudy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy'
  },
  visitor: VisitorDataSchema,
  pageViews: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  clickEvents: [ClickEventSchema],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);