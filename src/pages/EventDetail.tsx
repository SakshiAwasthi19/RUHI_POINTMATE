import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Button from '../components/common/Button';
import { DomainBadge } from '../components/common/Badge';
import { Calendar, MapPin, Clock, Award, Users, AlertCircle, Share2 } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, registerForEvent, userRegisteredEvents } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const event = getEventById(id || '');
  const [isRegistered, setIsRegistered] = useState(false);
  
  useEffect(() => {
    if (event && userRegisteredEvents.includes(event.id)) {
      setIsRegistered(true);
    }
  }, [event, userRegisteredEvents]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  
  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && event) {
      registerForEvent(event.id, user.id);
      setIsRegistered(true);
    }
  };
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">Event not found</h2>
        <p className="mt-1 text-sm text-gray-500">The event you are looking for does not exist or has been removed.</p>
        <div className="mt-6">
          <Button onClick={() => navigate('/events')}>
            Browse Events
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Event header */}
        <div className="relative h-64 md:h-96 bg-blue-600">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <DomainBadge domain={event.domain} />
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                {event.aictePoints} AICTE Points
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">{event.title}</h1>
            <p className="mt-2 text-lg text-white opacity-90">By {event.organizationName}</p>
          </div>
        </div>
        
        {/* Event details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          <div className="md:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AICTE Points Information</h2>
              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <Award className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800">Earn {event.aictePoints} AICTE Points</h3>
                  <p className="text-blue-700 mt-1">
                    Participating in this event will count towards your AICTE points requirement.
                    This event falls under the <strong>{event.domain}</strong> domain.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Date</h4>
                    <p className="text-gray-900">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Time</h4>
                    <p className="text-gray-900">
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Location</h4>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Organized by</h4>
                    <p className="text-gray-900">{event.organizationName}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                {user && user.role === UserRole.STUDENT && (
                  isRegistered ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                      <p className="text-green-800 font-medium">You're registered for this event!</p>
                      <p className="text-green-700 text-sm mt-1">
                        Don't forget to attend and earn your {event.aictePoints} AICTE points.
                      </p>
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handleRegister}
                    >
                      Register for Event
                    </Button>
                  )
                )}
                
                {!isAuthenticated && (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleRegister}
                  >
                    Sign in to Register
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Share2 size={16} />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: `Check out this event: ${event.title}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  Share Event
                </Button>
              </div>
            </div>
            
            {event.latitude && event.longitude && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Location</h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-md">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${event.latitude},${event.longitude}&zoom=15&size=600x300&markers=color:red%7C${event.latitude},${event.longitude}&key=YOUR_API_KEY`}
                    alt="Event location map"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;