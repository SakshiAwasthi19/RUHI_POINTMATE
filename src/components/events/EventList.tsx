import React from 'react';
import { useEvents } from '../../context/EventContext';
import EventCard from './EventCard';

const EventList: React.FC = () => {
  const { filteredEvents } = useEvents();
  
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">Try changing your search criteria or check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;