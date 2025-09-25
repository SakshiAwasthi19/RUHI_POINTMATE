import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IEvent } from '../../types';
import Card, { CardImage, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import { DomainBadge } from '../common/Badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const viewEvent = () => {
    navigate(`/events/${event.id}`);
  };
  
  return (
    <Card 
      hoverable
      className="h-full flex flex-col"
    >
      <CardImage 
        src={event.posterUrl} 
        alt={event.title}
        className="h-48"
      />
      
      <CardBody className="flex-grow">
        <div className="flex justify-between items-start">
          <DomainBadge domain={event.domain} />
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
            {event.aictePoints} Points
          </span>
        </div>
        
        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {event.description}
        </p>
        
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon size={16} className="mr-1.5 text-gray-400" />
            {formatDate(event.startDate)}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon size={16} className="mr-1.5 text-gray-400" />
            {event.location}
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="border-t border-gray-100">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            By <span className="font-medium">{event.organizationName}</span>
          </p>
          <Button
            size="sm"
            onClick={viewEvent}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;