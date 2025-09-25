export enum EventDomain {
  TECHNICAL_SKILLS = "Technical Skills",
  SOFT_SKILLS = "Soft Skills",
  COMMUNITY_SERVICE = "Community Service",
  INNOVATION_ENTREPRENEURSHIP = "Innovation & Entrepreneurship"
}

export enum UserRole {
  STUDENT = "student",
  ORGANIZATION = "organization"
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  domain: EventDomain;
  aictePoints: number;
  posterUrl: string;
  startDate: string;
  endDate: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  studentId?: string;
  organizationId?: string;
  points?: number;
  totalEvents?: number;
  completedEvents?: number;
  registeredEvents?: string[];
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  totalParticipants?: number;
}

export interface IStudent extends IUser {
  studentId: string;
  points: number;
  totalEvents: number;
  completedEvents: number;
  registeredEvents: string[]; // Array of event IDs
}

export interface IOrganization extends IUser {
  organizationId: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  events?: IEvent[];
  totalEvents: number;
  totalParticipants: number;
}