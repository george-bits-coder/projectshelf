const express = require('express');
const { 
  getPortfolioAnalytics, 
  getCaseStudyAnalytics,
  trackView
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/portfolio', protect, getPortfolioAnalytics);
router.get('/case-study/:id', protect, getCaseStudyAnalytics);
router.post('/track', trackView);

module.exports = router;