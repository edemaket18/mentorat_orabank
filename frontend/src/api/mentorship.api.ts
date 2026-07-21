import axios from 'axios';

const API_URL = '/mentorship';
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/*
export interface Mentorship {
  mentor: any;
  intern: any;
  _id: number;
  mentorId: number;
  menteeId: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
} */

 
export interface Mentorship {
  _id: string;
  mentor: {
    name: string; _id: string; fullName: string 
};
  intern: {
    name:  string; _id: string; fullName: string 
}; 
  status: 'en cours' | 'terminé' | 'en attente';
  startDate: string;
  endDate?: string; 
  feedback?: string;
  createdAt: string;
  Number: string;
  updatedAt: string;
  data?: any;  
}


export const getMentorships = async (): Promise<Mentorship[]> => {
  const response = await API.get<Mentorship[]>(API_URL);
  return response.data;
};

export const getMentorshipById = async (id: number): Promise<Mentorship> => {
  const response = await API.get<Mentorship>(`${API_URL}/${id}`);
  return response.data;
};

export const createMentorship = async (mentorship: Omit<Mentorship, '_id'>): Promise<Mentorship> => {
  const response = await API.post<Mentorship>(API_URL, mentorship);
  return response.data;
};

export const updateMentorship = async (id: number, mentorship: Partial<Mentorship>): Promise<Mentorship> => {
  const response = await API.put<Mentorship>(`${API_URL}/${id}`, mentorship);
  return response.data;
};

export const deleteMentorship = async (id: number): Promise<void> => {
  await API.delete(`${API_URL}/${id}`);
};
 
export const deleteMentorshipById = async (id: string): Promise<void> => {
  await API.delete(`/admin/mentorships/${id}`);
};

export const getMyMentorships = async (): Promise<Mentorship[]> => {
  const response = await API.get<Mentorship[]>('/mentorships/my');
  return response.data;
};
export const getMentorshipsByMentorId = async (mentorId: string): Promise<Mentorship[]> => {
  const response = await API.get<Mentorship[]>(`${API_URL}/mentor/${mentorId}`);
  return response.data;
};

export const getMentorshipDetails = async (id: string): Promise<Mentorship> => {
  const response = await API.get<Mentorship>(`${API_URL}/${id}`);
  return response.data;
};

export const getAllMentorships = async (): Promise<Mentorship[]> => {
  const response = await API.get<Mentorship[]>('/mentorships/all');
  return response.data;
};
 
export const endMentorship = (id: string) => {
  return API.put(`/mentorships/${id}/end`);
};