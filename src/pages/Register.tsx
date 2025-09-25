import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Lock, User, Building, AlertCircle, GraduationCap as Graduation, Phone, Globe } from 'lucide-react';

const Register: React.FC = () => {
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  
  // Student specific fields
  const [studentId, setStudentId] = useState('');
  
  // Organization specific fields
  const [organizationId, setOrganizationId] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  
  const { registerStudent, registerOrganization } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Role-specific validation
    if (role === UserRole.STUDENT) {
      if (!studentId) {
        setError('Student ID is required');
        return;
      }
      
      try {
        await registerStudent(name, email, password, studentId);
        navigate('/dashboard');
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Student registration failed. Please try again.');
      }
    } else {
      if (!organizationId) {
        setError('Organization ID is required');
        return;
      }
      
      try {
        await registerOrganization(
          name, 
          email, 
          password, 
          organizationId, 
          description
        );
        navigate('/organization/dashboard');
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Organization registration failed. Please try again.');
      }
    }
  };
  
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    // Reset form fields when switching roles
    if (newRole === UserRole.STUDENT) {
      setOrganizationId('');
      setDescription('');
      setAddress('');
      setPhone('');
      setWebsite('');
    } else {
      setStudentId('');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Graduation className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRoleChange(UserRole.STUDENT)}
                    className={`flex-1 py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      role === UserRole.STUDENT
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <User className="inline-block h-5 w-5 mr-2" />
                    Student
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRoleChange(UserRole.ORGANIZATION)}
                    className={`flex-1 py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      role === UserRole.ORGANIZATION
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Building className="inline-block h-5 w-5 mr-2" />
                    Organization
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            {role === UserRole.STUDENT ? (
              <div>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  leftIcon={<Graduation className="h-5 w-5 text-gray-400" />}
                />
              </div>
            ) : (
              <>
                <div>
                  <Input
                    id="organizationId"
                    name="organizationId"
                    type="text"
                    required
                    placeholder="Organization ID"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    leftIcon={<Building className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="Website URL (optional)"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    leftIcon={<Globe className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Organization address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about your organization..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;