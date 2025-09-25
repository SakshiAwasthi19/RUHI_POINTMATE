import React, { useState } from 'react';
import { EventDomain, IEvent } from '../../types';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { Calendar, MapPin, Info, Award, Upload } from 'lucide-react';

type EventFormData = Omit<IEvent, 'id'>;

const EventForm: React.FC = () => {
  const { addEvent } = useEvents();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    organizationId: user?.id || '',
    organizationName: user?.name || '',
    domain: EventDomain.TECHNICAL_SKILLS,
    aictePoints: 5,
    posterUrl: '',
    startDate: '',
    endDate: '',
    location: '',
    latitude: undefined,
    longitude: undefined
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'aictePoints' ? parseInt(value, 10) : value
    });
    
    // Clear error when field is being edited
    if (errors[name as keyof EventFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.posterUrl.trim()) {
      newErrors.posterUrl = 'Poster URL is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.aictePoints < 1) {
      newErrors.aictePoints = 'AICTE points must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addEvent(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        organizationId: user?.id || '',
        organizationName: user?.name || '',
        domain: EventDomain.TECHNICAL_SKILLS,
        aictePoints: 5,
        posterUrl: '',
        startDate: '',
        endDate: '',
        location: '',
        latitude: undefined,
        longitude: undefined
      });
      
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Event Information</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            fullWidth
            required
          />
          
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
              Domain
            </label>
            <select
              id="domain"
              name="domain"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.domain}
              onChange={handleChange}
            >
              {Object.values(EventDomain).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          
          <Input
            type="number"
            label="AICTE Points"
            name="aictePoints"
            value={formData.aictePoints.toString()}
            onChange={handleChange}
            error={errors.aictePoints}
            min={1}
            max={50}
            required
            leftIcon={<Award size={16} />}
          />
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Event Media</h3>
        
        <div className="space-y-4">
          <Input
            label="Poster URL"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            error={errors.posterUrl}
            fullWidth
            required
            placeholder="https://example.com/poster.jpg"
            leftIcon={<Upload size={16} />}
          />
          
          {formData.posterUrl && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster Preview
              </label>
              <div className="max-w-xs mx-auto border rounded-lg overflow-hidden">
                <img src={formData.posterUrl} alt="Poster preview" className="w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Date and Location</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            type="datetime-local"
            label="Start Date and Time"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
            leftIcon={<Calendar size={16} />}
          />
          
          <Input
            type="datetime-local"
            label="End Date and Time"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
            leftIcon={<Calendar size={16} />}
          />
          
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            fullWidth
            required
            leftIcon={<MapPin size={16} />}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<Info />}
        >
          Create Event
        </Button>
      </div>
    </form>
  );
};

export default EventForm;