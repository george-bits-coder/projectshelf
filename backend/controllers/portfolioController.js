const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/portfolio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

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
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    try {
      // Parse socialLinks if it's a string
      if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      }

      // Convert published to boolean
      if (req.body.published) {
        req.body.published = req.body.published === 'true';
      }

      // Handle file uploads
      const updates = { ...req.body };
      
      if (req.files) {
        if (req.files.profilePicture && req.files.profilePicture[0]) {
          updates.profilePicture = `/uploads/portfolio/${req.files.profilePicture[0].filename}`;
        }
        
        if (req.files.coverImage && req.files.coverImage[0]) {
          updates.coverImage = `/uploads/portfolio/${req.files.coverImage[0].filename}`;
        }
      }

      let portfolio = await Portfolio.findOne({ user: req.user.id });

      if (!portfolio) {
        // Create new portfolio
        updates.user = req.user.id;
        portfolio = await Portfolio.create(updates);
        
        return res.status(201).json({
          success: true,
          data: portfolio
        });
      }

      // Update existing portfolio
      portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id },
        updates,
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
      console.error('Portfolio update error:', err);
      next(err);
    }
  });
};

// @desc    Update portfolio theme
// @route   PUT /api/portfolio/theme
// @access  Private
exports.updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Theme is required'
      });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { theme },
      {
        new: true,
        runValidators: true,
        upsert: true // Create if not exists
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
    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      // Create a default portfolio with published status
      portfolio = await Portfolio.create({
        user: req.user.id,
        published: true
      });
    } else {
      // Toggle existing portfolio publish status
      portfolio.published = !portfolio.published;
      await portfolio.save();
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
};