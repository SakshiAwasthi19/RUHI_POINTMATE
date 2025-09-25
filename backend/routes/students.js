const express = require('express');
const {
  testStudentModel,
  getStudentProfile,
  createOrUpdateStudentProfile,
  updateProfilePicture
} = require('../controllers/students');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Test route - no authentication required
router.get('/test', testStudentModel);

// All other routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Student profile routes
router.get('/profile', getStudentProfile);
router.post('/profile', createOrUpdateStudentProfile);
router.put('/profile/picture', updateProfilePicture);

module.exports = router;
