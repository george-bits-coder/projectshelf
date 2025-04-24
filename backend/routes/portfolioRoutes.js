const express = require('express');
const { 
  getPortfolio, 
  createUpdatePortfolio, 
  updateTheme, 
  togglePublish 
} = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getPortfolio)
  .post(protect, createUpdatePortfolio);

router.put('/theme', protect, updateTheme);
router.put('/publish', protect, togglePublish);

module.exports = router;