import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { UserRole, EventDomain } from '../types';
import PointsProgress from '../components/dashboard/PointsProgress';
import EventList from '../components/events/EventList';
import EventForm from '../components/events/EventForm';
import { Award, Calendar, Filter, ChevronRight, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, userRegisteredEvents } = useEvents();
  
  // Calculate total points for student
  const calculateTotalPoints = () => {
    if (!user || user.role !== UserRole.STUDENT) return 0;
    
    return userRegisteredEvents.reduce((total, eventId) => {
      const event = events.find(e => e.id === eventId);
      return total + (event?.aictePoints || 0);
    }, 0);
  };
  
  // Calculate domain breakdown
  const getDomainBreakdown = () => {
    if (!user || user.role !== UserRole.STUDENT) return [];
    
    const domains = Object.values(EventDomain);
    const domainPoints: Record<string, number> = {};
    
    // Initialize all domains with 0 points
    domains.forEach(domain => {
      domainPoints[domain] = 0;
    });
    
    // Sum points by domain
    userRegisteredEvents.forEach(eventId => {
      const event = events.find(e => e.id === eventId);
      if (event) {
        domainPoints[event.domain] += event.aictePoints;
      }
    });
    
    // Convert to array format required by the PointsProgress component
    return Object.entries(domainPoints).map(([domain, points]) => {
      let color;
      switch (domain) {
        case EventDomain.TECHNICAL_SKILLS:
          color = '#3B82F6'; // blue
          break;
        case EventDomain.SOFT_SKILLS:
          color = '#8B5CF6'; // purple
          break;
        case EventDomain.COMMUNITY_SERVICE:
          color = '#10B981'; // green
          break;
        case EventDomain.INNOVATION_ENTREPRENEURSHIP:
          color = '#F97316'; // orange
          break;
        default:
          color = '#6B7280'; // gray
      }
      
      return {
        domain,
        points,
        color
      };
    }).filter(item => item.points > 0);
  };
  
  if (!user) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === UserRole.STUDENT ? 'Student Dashboard' : 'Organization Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === UserRole.STUDENT
              ? 'Track your AICTE points progress and registered events'
              : 'Manage your events and track participant registrations'}
          </p>
        </div>
      </div>
      
      {user.role === UserRole.STUDENT ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <PointsProgress
                totalPoints={calculateTotalPoints()}
                domainBreakdown={getDomainBreakdown()}
              />
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  <a href="/profile" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-50">
                    <User className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Profile Settings</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </a>
                  <a href="/events" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-50">
                    <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Browse All Events</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </a>
                  <a href="#registered-events" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-50">
                    <Award className="mr-3 h-5 w-5 text-gray-400" />
                    <span>My Registered Events</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </a>
                  <a href="/events?filter=upcoming" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-50">
                    <Filter className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Upcoming Events</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" id="registered-events">
                My Registered Events
              </h3>
              
              {userRegisteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No registered events</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't registered for any events yet.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/events"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Events
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {events
                    .filter(event => userRegisteredEvents.includes(event.id))
                    .map(event => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg overflow-hidden flex flex-col sm:flex-row"
                      >
                        <div className="h-32 sm:h-auto sm:w-32 flex-shrink-0">
                          <img
                            src={event.posterUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-500">{event.organizationName}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {event.aictePoints} Points
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Event</h3>
            <EventForm />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Events</h3>
            <EventList />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;