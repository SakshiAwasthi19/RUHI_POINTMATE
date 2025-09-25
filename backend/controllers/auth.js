const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Student = require('../models/Student');

// @desc    Register a new student
// @route   POST /api/v1/auth/register/student
// @access  Public
exports.registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, studentId } = req.body;

    // Check if user already exists with this email in users collection only
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists. Login to your account.' 
      });
    }

    // Check if student ID already exists
    const existingStudentId = await User.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      studentId
    });

    // Create basic student profile
    await Student.create({
      userId: user._id,
      email: user.email,
      fullName: user.name,
      studentId: user.studentId
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        points: user.points
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register a new organization
// @route   POST /api/v1/auth/register/organization
// @access  Public
exports.registerOrganization = async (req, res, next) => {
  try {
    const { name, email, password, organizationId, description, address, phone, website } = req.body;

    // Check if organization already exists with this email in organizations collection only
    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists. Login to your account.' 
      });
    }

    // Check if organization ID already exists in orgs collection
    const existingOrgId = await Organization.findOne({ organizationId });
    if (existingOrgId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Organization ID already exists' 
      });
    }

    // Create organization account in its own collection
    const org = await Organization.create({
      name,
      email,
      password,
      role: 'organization',
      organizationId,
      description,
      address,
      phone,
      website
    });

    // Create token
    const token = org.getSignedJwtToken();

    res.status(201).json({ 
      success: true, 
      message: 'Organization registered successfully',
      token,
      user: {
        id: org._id,
        name: org.name,
        email: org.email,
        role: org.role,
        organizationId: org.organizationId
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (student or organization)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an email and password' 
      });
    }

    // Try to find user in student collection first, then organization
    let account = await User.findOne({ email }).select('+password');
    if (!account) {
      account = await Organization.findOne({ email }).select('+password');
    }

    if (!account) {
      return res.status(401).json({ 
        success: false, 
        message: 'User does not exist. Register first.' 
      });
    }

    if (!account.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    // Check if password matches
    const isMatch = await account.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password. Please try again.' 
      });
    }

    // Update last login
    await account.updateLastLogin();

    // Create token
    const token = account.getSignedJwtToken();

    // Prepare response based on actual role on the document
    let userData;
    if (account.role === 'student') {
      userData = {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        studentId: account.studentId,
        points: account.points
      };
    } else {
      userData = {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        organizationId: account.organizationId
      };
    }

    res.status(200).json({ 
      success: true, 
      message: `${(account.role || 'user').charAt(0).toUpperCase() + (account.role || 'user').slice(1)} logged in successfully`,
      token,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const sourceModel = req.user.role === 'organization' ? Organization : User;
    const user = await sourceModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const sourceModel = req.user.role === 'organization' ? Organization : User;
    const user = await sourceModel.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide current and new password' 
      });
    }

    const sourceModel = req.user.role === 'organization' ? Organization : User;
    const user = await sourceModel.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user points (students only)
// @route   GET /api/v1/auth/points
// @access  Private (Students)
exports.getPoints = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only students can access points' 
      });
    }

    const user = await User.findById(req.user.id);
    res.status(200).json({ 
      success: true, 
      data: { 
        points: user.points,
        totalEvents: user.totalEvents,
        completedEvents: user.completedEvents
      } 
    });
  } catch (err) {
    next(err);
  }
};
