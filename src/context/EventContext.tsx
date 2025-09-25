import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IEvent, EventDomain } from '../types';

// Sample event data
const MOCK_EVENTS: IEvent[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn the fundamentals of modern web development with React and Node.js.',
    organizationId: '101',
    organizationName: 'IEEE VTU Student Branch',
    domain: EventDomain.TECHNICAL_SKILLS,
    aictePoints: 15,
    posterUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    startDate: '2025-06-15T09:00:00',
    endDate: '2025-06-15T17:00:00',
    location: 'Main Campus, Building A',
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: '2',
    title: 'Leadership Development Program',
    description: 'Develop essential leadership and management skills for your career.',
    organizationId: '102',
    organizationName: 'Management Club',
    domain: EventDomain.SOFT_SKILLS,
    aictePoints: 10,
    posterUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    startDate: '2025-06-20T10:00:00',
    endDate: '2025-06-21T16:00:00',
    location: 'E-Block Auditorium',
    latitude: 12.9720,
    longitude: 77.5930
  },
  {
    id: '3',
    title: 'Campus Cleanup Drive',
    description: 'Join us in making our campus cleaner and greener.',
    organizationId: '103',
    organizationName: 'Eco Club',
    domain: EventDomain.COMMUNITY_SERVICE,
    aictePoints: 8,
    posterUrl: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg',
    startDate: '2025-06-18T08:00:00',
    endDate: '2025-06-18T12:00:00',
    location: 'Campus Grounds',
    latitude: 12.9710,
    longitude: 77.5950
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Showcase your innovative business ideas and win funding.',
    organizationId: '104',
    organizationName: 'E-Cell',
    domain: EventDomain.INNOVATION_ENTREPRENEURSHIP,
    aictePoints: 20,
    posterUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
    startDate: '2025-07-05T11:00:00',
    endDate: '2025-07-05T18:00:00',
    location: 'Incubation Center',
    latitude: 12.9726,
    longitude: 77.5940
  },
];

interface EventContextType {
  events: IEvent[];
  filteredEvents: IEvent[];
  addEvent: (event: Omit<IEvent, 'id'>) => void;
  getEventById: (id: string) => IEvent | undefined;
  registerForEvent: (eventId: string, userId: string) => void;
  filterEvents: (domain?: EventDomain, searchTerm?: string) => void;
  userRegisteredEvents: string[];
  setUserRegisteredEvents: React.Dispatch<React.SetStateAction<string[]>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const [events, setEvents] = useState<IEvent[]>(MOCK_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(MOCK_EVENTS);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    domain?: EventDomain;
    searchTerm?: string;
  }>({});

  const addEvent = (event: Omit<IEvent, 'id'>) => {
    const newEvent: IEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const registerForEvent = (eventId: string, userId: string) => {
    // In a real app, this would make an API call
    setUserRegisteredEvents(prev => [...prev, eventId]);
  };

  const filterEvents = (domain?: EventDomain, searchTerm?: string) => {
    setActiveFilters({ domain, searchTerm });
  };

  // Apply filters whenever events or filter criteria change
  useEffect(() => {
    let result = [...events];
    
    if (activeFilters.domain) {
      result = result.filter(event => event.domain === activeFilters.domain);
    }
    
    if (activeFilters.searchTerm) {
      const term = activeFilters.searchTerm.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.organizationName.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(result);
  }, [events, activeFilters]);

  const value = {
    events,
    filteredEvents,
    addEvent,
    getEventById,
    registerForEvent,
    filterEvents,
    userRegisteredEvents,
    setUserRegisteredEvents
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};