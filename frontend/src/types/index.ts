import { ReactNode } from "react";


 
export interface Match {
  _id: string;
  mentor: User;
  intern: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

 
// Types globaux de l'application
export interface User {
  phone: string;
  department: string;
  name: ReactNode;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'mentor' | 'intern' | 'hr';
  isActive: boolean;
  avatar?: string;
   bio?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Profile {
  _id: string;
  user: string;
  bio?: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  department?: string;
  position?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  isPublic: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id?: string;
  id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current?: boolean;
  duration?: string;
}

export interface Education {
  _id?: string;
  id?: string;
  title: string;
  institution: string;
  years: string;
  school?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  skills: string[];
  education: Education[];
  experiences: Experience[];
  isPublic: boolean;
  showSkills: boolean;
  showCv: boolean;
  cvUrl?: string;
}

export interface MentorMatch {
  id: string;
  fullName: string;
  avatar: string;
  commonSkills: string[];
}

export interface CalendarEvent {
  _id: string;
  id: string;
  title: string;
  start: Date;
  end: Date;
  status?: string;
  mentorName?: string;
  menteeName?: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  participantName: string;
  participantAvatar?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  content: string;
  createdAt: string;
}
 
 