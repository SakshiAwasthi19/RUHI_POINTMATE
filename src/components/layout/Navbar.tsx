import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap as Graduation, Bell, Menu, X, User, LogOut, Award, Home, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
  ];

  if (isAuthenticated) {
    navLinks.push({ 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: user?.role === UserRole.STUDENT ? <Award size={18} /> : <Calendar size={18} /> 
    });
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Graduation className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Point<span className="text-blue-600">Mate</span></span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive(link.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                      alt={user?.name}
                    />
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    alt={user?.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="mr-3" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  <LogOut size={18} className="mr-3" />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
              >
                Sign in
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;