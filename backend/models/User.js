const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'organization'],
    required: [true, 'Please specify user role']
  },
  // Student-specific fields
  studentId: {
    type: String,
    unique: true,
    sparse: true, // Only required when role is student
    trim: true
  },
  points: {
    type: Number,
    default: 0
  },
  totalEvents: {
    type: Number,
    default: 0
  },
  completedEvents: {
    type: Number,
    default: 0
  },
  // Organization-specific fields
  organizationId: {
    type: String,
    unique: true,
    sparse: true, // Only required when role is organization
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please add a valid phone number']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please add a valid website URL']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  // Common fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Validate required fields based on role
userSchema.pre('save', async function(next) {
  if (this.role === 'student' && !this.studentId) {
    return next(new Error('Student ID is required for students'));
  }
  if (this.role === 'organization' && !this.organizationId) {
    return next(new Error('Organization ID is required for organizations'));
  }
  next();
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || config.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || config.JWT_EXPIRE }
  );
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
