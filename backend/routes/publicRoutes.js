const express = require('express');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const CaseStudy = require('../models/CaseStudy');
const router = express.Router();

// @desc    Get public portfolio by username
// @route   GET /:username
router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const portfolio = await Portfolio.findOne({ user: user._id });

    if (!portfolio || !portfolio.published) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found or not published'
      });
    }

    const caseStudies = await CaseStudy.find({ 
      portfolio: portfolio._id,
      published: true
    }).sort('-featured -createdAt');

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          username: user.username
        },
        portfolio,
        caseStudies
      }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get public case study by username and slug
// @route   GET /:username/:slug
router.get('/:username/:slug', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const portfolio = await Portfolio.findOne({ user: user._id });

    if (!portfolio || !portfolio.published) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found or not published'
      });
    }

    const caseStudy = await CaseStudy.findOne({
      portfolio: portfolio._id,
      slug: req.params.slug,
      published: true
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found or not published'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          username: user.username
        },
        portfolio,
        caseStudy
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;