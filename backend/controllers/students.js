const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Test endpoint to check if Student model is working
// @route   GET /api/v1/students/test
// @access  Public
exports.testStudentModel = async (req, res, next) => {
  try {
    console.log('Testing Student model...');
    console.log('Student model:', Student);
    console.log('Student schema:', Student.schema);
    
    // Try to create a simple test document
    const testStudent = new Student({
      userId: '507f1f77bcf86cd799439011', // dummy ObjectId
      email: 'test@example.com',
      fullName: 'Test Student'
    });
    
    console.log('Test student instance created:', testStudent);
    
    res.status(200).json({
      success: true,
      message: 'Student model is working',
      modelInfo: {
        modelName: Student.modelName,
        collectionName: Student.collection.name
      }
    });
  } catch (err) {
    console.error('Error testing Student model:', err);
    res.status(500).json({
      success: false,
      message: 'Student model error',
      error: err.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/v1/students/profile
// @access  Private (Students only)
exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or update student profile
// @route   POST /api/v1/students/profile
// @access  Private (Students only)
exports.createOrUpdateStudentProfile = async (req, res, next) => {
  try {
    console.log('Creating/updating student profile for user:', req.user.id);
    console.log('Request body:', req.body);
    
    const {
      fullName,
      collegeName,
      studentId,
      year,
      branch,
      semester,
      graduationYear,
      address,
      phoneNumber,
      profilePicture
    } = req.body;
    
    // Check if student profile already exists
    let student = await Student.findOne({ userId: req.user.id });
    console.log('Existing student profile:', student);
    
    if (student) {
      // Update existing profile
      console.log('Updating existing profile...');
      student = await Student.findOneAndUpdate(
        { userId: req.user.id },
        {
          fullName,
          collegeName,
          studentId,
          year,
          branch,
          semester,
          graduationYear,
          address,
          phoneNumber,
          profilePicture
        },
        {
          new: true,
          runValidators: true
        }
      );
      console.log('Profile updated:', student);
    } else {
      // Create new profile
      console.log('Creating new profile...');
      student = await Student.create({
        userId: req.user.id,
        email: req.user.email,
        fullName,
        collegeName,
        studentId,
        year,
        branch,
        semester,
        graduationYear,
        address,
        phoneNumber,
        profilePicture
      });
      console.log('Profile created:', student);
    }
    
    res.status(200).json({
      success: true,
      message: student ? 'Profile updated successfully' : 'Profile created successfully',
      data: student
    });
  } catch (err) {
    console.error('Error in createOrUpdateStudentProfile:', err);
    next(err);
  }
};

// @desc    Update student profile picture
// @route   PUT /api/v1/students/profile/picture
// @access  Private (Students only)
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const { profilePicture } = req.body;
    
    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'Profile picture URL is required'
      });
    }
    
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { profilePicture },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: student
    });
  } catch (err) {
    next(err);
  }
};
