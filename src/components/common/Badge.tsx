import React from 'react';
import { EventDomain } from '../../types';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DomainBadge: React.FC<{ domain: EventDomain }> = ({ domain }) => {
  const variantMap: Record<EventDomain, BadgeVariant> = {
    [EventDomain.TECHNICAL_SKILLS]: 'primary',
    [EventDomain.SOFT_SKILLS]: 'info',
    [EventDomain.COMMUNITY_SERVICE]: 'success',
    [EventDomain.INNOVATION_ENTREPRENEURSHIP]: 'warning'
  };
  
  return (
    <Badge variant={variantMap[domain]}>
      {domain}
    </Badge>
  );
};

export default Badge;