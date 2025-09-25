import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUser, UserRole } from '../types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (name: string, email: string, password: string, studentId: string) => Promise<void>;
  registerOrganization: (name: string, email: string, password: string, organizationId: string, description?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:5001/api/v1';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Unified login function for both students and organizations
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      
      // Set user data based on role
      const userData: IUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        profilePicture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      };

      // Add role-specific fields
      if (data.user.role === 'student') {
        userData.studentId = data.user.studentId;
        userData.points = data.user.points;
      } else if (data.user.role === 'organization') {
        userData.organizationId = data.user.organizationId;
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function for students
  const registerStudent = async (name: string, email: string, password: string, studentId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, studentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      
      // Set user data
      const userData: IUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentId: data.user.studentId,
        points: data.user.points,
        profilePicture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function for organizations
  const registerOrganization = async (name: string, email: string, password: string, organizationId: string, description?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, organizationId, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      
      // Set user data
      const userData: IUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        organizationId: data.user.organizationId,
        profilePicture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Check for existing user session on init
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerStudent,
    registerOrganization,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};