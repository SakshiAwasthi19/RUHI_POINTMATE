import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { EventDomain } from '../types';
import EventList from '../components/events/EventList';
import Input from '../components/common/Input';
import { Search, Filter, Calendar, Award } from 'lucide-react';

const Events: React.FC = () => {
  const { filterEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<EventDomain | undefined>(undefined);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterEvents(selectedDomain, value);
  };
  
  const handleDomainFilter = (domain: EventDomain | undefined) => {
    setSelectedDomain(domain);
    filterEvents(domain, searchTerm);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:items-center md:justify-between md:flex-row mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and register for events to earn AICTE points
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search events by title, description, or organization..."
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              leftIcon={<Search size={16} />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Domain
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedDomain || ''}
                onChange={(e) => handleDomainFilter(e.target.value ? e.target.value as EventDomain : undefined)}
              >
                <option value="">All Domains</option>
                {Object.values(EventDomain).map(domain => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleDomainFilter(undefined)}
            className={`flex items-center justify-center p-4 rounded-md transition-colors ${
              selectedDomain === undefined
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="mr-2 h-5 w-5" />
            All Events
          </button>
          
          <button
            onClick={() => handleDomainFilter(EventDomain.TECHNICAL_SKILLS)}
            className={`flex items-center justify-center p-4 rounded-md transition-colors ${
              selectedDomain === EventDomain.TECHNICAL_SKILLS
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Technical Skills
          </button>
          
          <button
            onClick={() => handleDomainFilter(EventDomain.SOFT_SKILLS)}
            className={`flex items-center justify-center p-4 rounded-md transition-colors ${
              selectedDomain === EventDomain.SOFT_SKILLS
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Award className="mr-2 h-5 w-5" />
            Soft Skills
          </button>
          
          <button
            onClick={() => handleDomainFilter(EventDomain.COMMUNITY_SERVICE)}
            className={`flex items-center justify-center p-4 rounded-md transition-colors ${
              selectedDomain === EventDomain.COMMUNITY_SERVICE
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Award className="mr-2 h-5 w-5" />
            Community Service
          </button>
        </div>
      </div>
      
      <EventList />
    </div>
  );
};

export default Events;