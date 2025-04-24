const express = require('express');
const { 
  getCaseStudies, 
  getCaseStudy, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy,
  togglePublishCaseStudy,
  toggleFeatureCaseStudy,
  upload
} = require('../controllers/caseStudyController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Helper middleware to handle file uploads
const handleUpload = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next();
  });
};

router.route('/')
  .get(protect, getCaseStudies)
  .post(protect, handleUpload, createCaseStudy);

router.route('/:id')
  .get(protect, getCaseStudy)
  .put(protect, handleUpload, updateCaseStudy)
  .delete(protect, deleteCaseStudy);

router.put('/:id/publish', protect, togglePublishCaseStudy);
router.put('/:id/feature', protect, toggleFeatureCaseStudy);

module.exports = router;