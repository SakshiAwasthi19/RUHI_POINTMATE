const express = require('express');
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  registerForEvent,
  markAttendance,
  getEventsByOrganization,
  getMyEvents
} = require('../controllers/events');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('organization'), createEvent);

// Specific routes must come before parameterized routes
router.get('/organization/:id', getEventsByOrganization);
router.get('/my-events', protect, authorize('student'), getMyEvents);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('organization'), updateEvent)
  .delete(protect, authorize('organization'), deleteEvent);

router.put('/:id/register', protect, authorize('student'), registerForEvent);
router.put('/:id/attendance', protect, authorize('organization'), markAttendance);

module.exports = router;
