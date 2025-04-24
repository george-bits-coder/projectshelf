const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// @desc    Get portfolio by user ID
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or update portfolio
// @route   POST /api/portfolio
// @access  Private
exports.createUpdatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      // Create new portfolio
      portfolio = await Portfolio.create({
        user: req.user.id,
        ...req.body
      });
      
      return res.status(201).json({
        success: true,
        data: portfolio
      });
    }

    // Update existing portfolio
    portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update portfolio theme
// @route   PUT /api/portfolio/theme
// @access  Private
exports.updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { theme },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Publish/unpublish portfolio
// @route   PUT /api/portfolio/publish
// @access  Private
exports.togglePublish = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    portfolio.published = !portfolio.published;
    await portfolio.save();

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
};