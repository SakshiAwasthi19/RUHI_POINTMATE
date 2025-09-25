const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('organization', 'name email organizationId')
      .sort('-createdAt');
    
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organization', 'name email organizationId description')
      .populate('participants.user', 'name email studentId');
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Create event
// @route   POST /api/v1/events
// @access  Private (Organization)
exports.createEvent = async (req, res, next) => {
  try {
    // Add organization to req.body
    req.body.organization = req.user.id;
    
    const event = await Event.create(req.body);
    
    // Update organization's total events count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalEvents: 1 }
    });
    
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private (Organization)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Make sure user is event owner
    if (event.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private (Organization)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Make sure user is event owner
    if (event.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    // Update organization's total events count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalEvents: -1 }
    });
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Register for event
// @route   PUT /api/v1/events/:id/register
// @access  Private (Student)
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    if (!event.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'This event is not active' 
      });
    }
    
    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ 
        success: false, 
        message: 'This event is full' 
      });
    }
    
    // Check if already registered
    const existingRegistration = event.participants.find(
      participant => participant.user.toString() === req.user.id
    );
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }
    
    event.participants.unshift({ user: req.user.id });
    await event.save();
    
    // Update user's total events count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalEvents: 1 }
    });
    
    // Update organization's total participants count
    await User.findByIdAndUpdate(event.organization, {
      $inc: { totalParticipants: 1 }
    });
    
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark event attendance
// @route   PUT /api/v1/events/:id/attendance
// @access  Private (Organization)
exports.markAttendance = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Make sure user is event owner
    if (event.organization.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this event'
      });
    }
    
    const participant = event.participants.find(
      p => p.user.toString() === userId
    );
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not registered for this event'
      });
    }
    
    const oldStatus = participant.status;
    participant.status = status;
    
    // If event is completed, award points and update counts
    if (status === 'completed' && oldStatus !== 'completed') {
      const user = await User.findById(userId);
      if (user) {
        user.points += event.points;
        user.completedEvents += 1;
        await user.save();
      }
      
      participant.completedAt = new Date();
    }
    
    await event.save();
    
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// @desc    Get events by organization
// @route   GET /api/v1/events/organization/:id
// @access  Public
exports.getEventsByOrganization = async (req, res, next) => {
  try {
    const events = await Event.find({ 
      organization: req.params.id,
      isActive: true 
    }).populate('organization', 'name email organizationId');
    
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's registered events
// @route   GET /api/v1/events/my-events
// @access  Private (Student)
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      'participants.user': req.user.id
    }).populate('organization', 'name email organizationId');
    
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};
