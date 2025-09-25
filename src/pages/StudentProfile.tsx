import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ArrowLeft, User, Mail, GraduationCap, MapPin, Phone, Camera } from 'lucide-react';

interface StudentProfileData {
  fullName: string;
  collegeName: string;
  studentId: string;
  year: string;
  branch: string;
  semester: string;
  graduationYear: string;
  address: string;
  phoneNumber: string;
  profilePicture: string;
}

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<StudentProfileData>({
    fullName: '',
    collegeName: '',
    studentId: '',
    year: '',
    branch: '',
    semester: '',
    graduationYear: '',
    address: '',
    phoneNumber: '',
    profilePicture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  });

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  useEffect(() => {
    // Load existing profile data if available
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/students/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (field: keyof StudentProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/v1/students/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to save profile');
      }
    } catch (error) {
      setMessage('An error occurred while saving the profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll use a placeholder. In a real app, you'd upload to a service like Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('profilePicture', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="College Name"
                  value={profileData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  placeholder="Enter your college name"
                  leftIcon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Student ID"
                  value={profileData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder="Enter your student ID"
                  leftIcon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to upload a new profile picture</p>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={profileData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select year</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Branch"
                  value={profileData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  placeholder="Enter your branch"
                  leftIcon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Semester"
                  value={profileData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  placeholder="Enter your current semester"
                  leftIcon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Graduation Year"
                  value={profileData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  placeholder="Enter your expected graduation year"
                  leftIcon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <Input
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                  leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
