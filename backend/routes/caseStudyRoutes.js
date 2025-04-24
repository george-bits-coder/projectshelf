const express = require('express');
const { 
  getCaseStudies, 
  getCaseStudy, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy,
  togglePublishCaseStudy,
  toggleFeatureCaseStudy
} = require('../controllers/caseStudyController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCaseStudies)
  .post(protect, createCaseStudy);

router.route('/:id')
  .get(protect, getCaseStudy)
  .put(protect, updateCaseStudy)
  .delete(protect, deleteCaseStudy);

router.put('/:id/publish', protect, togglePublishCaseStudy);
router.put('/:id/feature', protect, toggleFeatureCaseStudy);

module.exports = router;