import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Button from '../components/common/Button';
import { Award, Calendar, Filter, User, MapPin, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  const pointCategories = [
    {
      domain: 'Technical Skills',
      icon: <Filter className="h-6 w-6 text-blue-600" />,
      description: 'Workshops, coding competitions, hackathons, and technical training sessions.'
    },
    {
      domain: 'Soft Skills',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: 'Leadership programs, communication workshops, personal development seminars.'
    },
    {
      domain: 'Community Service',
      icon: <User className="h-6 w-6 text-green-600" />,
      description: 'Volunteering, social initiatives, environmental activities, and outreach programs.'
    },
    {
      domain: 'Innovation & Entrepreneurship',
      icon: <Calendar className="h-6 w-6 text-orange-600" />,
      description: 'Startup competitions, innovation challenges, business idea pitches, entrepreneurship workshops.'
    }
  ];
  
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center lg:pt-32 lg:pb-40">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Track Your AICTE Points Journey
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            Participate in campus activities, workshops, and events to earn points required for your graduation. Monitor your progress and never miss an opportunity.
          </p>
          <div className="mt-10 flex justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="ml-4 text-white border-white hover:bg-blue-400"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="ml-4 text-white border-white hover:bg-blue-400"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 h-32 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </div>
      
      {/* Points requirement section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How AICTE Points Work
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Students need a minimum of 100 points to graduate. Points can be earned across various domains through participation in different activities.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pointCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center items-center w-12 h-12 rounded-md bg-gray-100 mx-auto">
                {category.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{category.domain}</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Features For Everyone
            </h2>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Student features */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <User className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">For Students</h3>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Track your points progress</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Discover and register for upcoming events</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Filter className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Filter events by domain and points value</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <MapPin className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Find events near your location</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4">
                  <Button
                    variant={isAuthenticated && user?.role === UserRole.STUDENT ? 'primary' : 'outline'}
                    fullWidth
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                  >
                    {isAuthenticated && user?.role === UserRole.STUDENT ? 'Go to Dashboard' : 'Sign Up as Student'}
                  </Button>
                </div>
              </div>
              
              {/* Organization features */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">For Organizations</h3>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Create and manage events</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Assign points to your events</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Filter className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Categorize events by domain</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Track student participation</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4">
                  <Button
                    variant={isAuthenticated && user?.role === UserRole.ORGANIZATION ? 'primary' : 'outline'}
                    fullWidth
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                  >
                    {isAuthenticated && user?.role === UserRole.ORGANIZATION ? 'Go to Dashboard' : 'Sign Up as Organization'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;