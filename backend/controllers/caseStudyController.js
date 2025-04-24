const CaseStudy = require('../models/CaseStudy');
const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads/case-studies';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer upload
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).array('media', 20); // Maximum 20 files

// Process uploaded files and other form data
const processFormData = (req) => {
  const data = {
    title: req.body.title,
    slug: req.body.slug,
    projectOverview: req.body.projectOverview,
    featured: req.body.featured === 'true',
    published: req.body.published === 'true',
    timeline: JSON.parse(req.body.timeline || '[]'),
    technologies: JSON.parse(req.body.technologies || '[]'),
    outcomes: JSON.parse(req.body.outcomes || '[]'),
    mediaGallery: []
  };

  // Process media files
  const mediaItems = [];
  const mediaKeys = Object.keys(req.body).filter(key => key.match(/media-\d+-data/));
  
  mediaKeys.forEach(key => {
    const index = key.match(/media-(\d+)-data/)[1];
    const mediaData = JSON.parse(req.body[key]);
    
    // Check if we have a file upload for this index
    if (req.files && req.files.some(file => file.fieldname === `media-${index}`)) {
      const file = req.files.find(file => file.fieldname === `media-${index}`);
      mediaData.url = `/uploads/case-studies/${file.filename}`;
    }
    
    mediaItems.push(mediaData);
  });

  data.mediaGallery = mediaItems;
  return data;
};

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
    console.error('Error in getCaseStudies:', err);
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
    console.error('Error in getCaseStudy:', err);
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

    // Process form data
    
    const caseStudyData = processFormData(req);
    caseStudyData.portfolio = portfolio._id;

    const caseStudy = await CaseStudy.create(caseStudyData);

    res.status(201).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    console.error('Error in createCaseStudy:', err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
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

    // Process form data
    const caseStudyData = processFormData(req);

    caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, caseStudyData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (err) {
    console.error('Error in updateCaseStudy:', err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
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

    // Delete associated media files if needed
    if (caseStudy.mediaGallery && caseStudy.mediaGallery.length > 0) {
      caseStudy.mediaGallery.forEach(media => {
        if (media.url) {
          const filePath = path.join(__dirname, '..', media.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    await caseStudy.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error in deleteCaseStudy:', err);
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
    console.error('Error in togglePublishCaseStudy:', err);
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
    console.error('Error in toggleFeatureCaseStudy:', err);
    next(err);
  }
};