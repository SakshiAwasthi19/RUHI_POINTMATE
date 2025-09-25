const express = require('express');
const { 
  registerStudent,
  registerOrganization,
  login,
  getMe,
  updateProfile,
  changePassword,
  getPoints
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Public routes - No authentication required
router.post('/register/student', registerStudent);
router.post('/register/organization', registerOrganization);
router.post('/login', login);

// Protected routes - Authentication required
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/points', protect, getPoints);

module.exports = router;
