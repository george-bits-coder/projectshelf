const CaseStudy = require('../models/CaseStudy');
const Portfolio = require('../models/Portfolio');

// @desc    Get all case studies for a portfolio
// @route   GET /api/case-study
// @access  Private
exports.getCaseStudies = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    const caseStudies = await CaseStudy.find({ portfolio: portfolio._id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: caseStudies.length,
      data: caseStudies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single case study
// @route   GET /api/case-study/:id
// @access  Private
exports.getCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    const caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create case study
// @route   POST /api/case-study
// @access  Private
exports.createCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    req.body.portfolio = portfolio._id;
    const caseStudy = await CaseStudy.create(req.body);

    res.status(201).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update case study
// @route   PUT /api/case-study/:id
// @access  Private
exports.updateCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    let caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete case study
// @route   DELETE /api/case-study/:id
// @access  Private
exports.deleteCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    const caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    await caseStudy.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle case study publish status
// @route   PUT /api/case-study/:id/publish
// @access  Private
exports.togglePublishCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    let caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    caseStudy.published = !caseStudy.published;
    await caseStudy.save();

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle case study featured status
// @route   PUT /api/case-study/:id/feature
// @access  Private
exports.toggleFeatureCaseStudy = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    let caseStudy = await CaseStudy.findOne({
      _id: req.params.id,
      portfolio: portfolio._id
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    caseStudy.featured = !caseStudy.featured;
    await caseStudy.save();

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    next(err);
  }
};