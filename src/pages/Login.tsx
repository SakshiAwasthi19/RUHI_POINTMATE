import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Lock, AlertCircle, GraduationCap as Graduation } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Navigate when user is authenticated
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.STUDENT) {
        navigate('/dashboard');
      } else if (user.role === UserRole.ORGANIZATION) {
        navigate('/organization/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      // Navigation will be handled by useEffect when user state changes
    } catch (err: any) {
      if (err.message.includes('User does not exist')) {
        setError('User does not exist. Register first.');
      } else if (err.message.includes('password')) {
        setError('Invalid password. Please try again.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Graduation className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              leftIcon={<Mail size={16} />}
            />
            
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              leftIcon={<Lock size={16} />}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail('student@vtu.edu');
                  setPassword('password');
                }}
              >
                Student Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail('org@vtu.edu');
                  setPassword('password');
                }}
              >
                Organization Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;