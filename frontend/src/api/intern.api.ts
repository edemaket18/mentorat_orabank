 
import axios from 'axios';

const API_URL = '/api/intern';
 
 
 export interface Intern {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  field?: string;
  startDate: string;
  endDate: string;
  status: 'online' | 'offline' | 'away';  
  mentorId?: string;
  mentorName?: string;
  data?: {
    monthlyRegistrations: { month: string; count: number }[];
  };
}

