const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Reference to the user account
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Email from login/registration (for future reference)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Please add your full name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  
  collegeName: {
    type: String,
    trim: true,
    maxlength: [200, 'College name cannot be more than 200 characters']
  },
  
  studentId: {
    type: String,
    trim: true,
    maxlength: [50, 'Student ID cannot be more than 50 characters']
  },
  
  // Academic Information
  year: {
    type: String,
    trim: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
  },
  
  branch: {
    type: String,
    trim: true,
    maxlength: [100, 'Branch cannot be more than 100 characters']
  },
  
  semester: {
    type: String,
    trim: true,
    maxlength: [50, 'Semester cannot be more than 50 characters']
  },
  
  graduationYear: {
    type: String,
    trim: true,
    maxlength: [10, 'Graduation year cannot be more than 10 characters']
  },
  
  // Contact Information
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot be more than 500 characters']
  },
  
  phoneNumber: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please add a valid phone number']
  },
  
  // Profile Picture
  profilePicture: {
    type: String,
    default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
