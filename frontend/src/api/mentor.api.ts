import axios from 'axios'; 
import { Intern } from '@api/intern.api';

const API_URL = '/api/mentors';

interface MentorStats {
  totalInterns: number;
  feedbacksCount: number;
  averageRating: number;
  data: {
    monthlyRegistrations: { month: string; count: number }[];
  };
}
export interface MentorReview {
  totalReviews: number;
  averageRating: number;
}

export interface MentorStatsResponse {
  data: MentorStats;
}

export interface Mentor {
  avatar: string;
  _id: string;
  name: string;
  email: string;
  expertise: string[];
  bio?: string;
  available: boolean;
  
}

// Récupérer les statistiques du mentor
export const getMentorStats = async (mentorId: string): Promise<MentorStatsResponse> => {
  const response = await axios.get<MentorStatsResponse>(`${API_URL}/stats`);
  return response.data;
};

export const getMentorReview = async (): Promise<MentorReview> => {
  const response = await axios.get<MentorReview>(`${API_URL}/reviews`);
  return response.data;
};

// Récupérer les stagiaires assignés à un mentor
export const getAssignedInterns = async (mentorId: string): Promise<Intern[]> => {
  const response = await axios.get<Intern[]>(`${API_URL}/${mentorId}/interns`);
  return response.data;
};

// Récupérer tous les mentors
export const getMentors = async (): Promise<Mentor[]> => {
  const response = await axios.get<Mentor[]>(API_URL);
  return response.data;
};

// Récupérer un mentor par ID
export const getMentorById = async (id: string): Promise<Mentor> => {
  const response = await axios.get<Mentor>(`${API_URL}/${id}`);
  return response.data;
};

// Créer un nouveau mentor
export const createMentor = async (mentor: Omit<Mentor, '_id'>): Promise<Mentor> => {
  const response = await axios.post<Mentor>(API_URL, mentor);
  return response.data;
};

// Mettre à jour un mentor existant
export const updateMentor = async (id: string, mentor: Partial<Mentor>): Promise<Mentor> => {
  const response = await axios.put<Mentor>(`${API_URL}/${id}`, mentor);
  return response.data;
};

// Supprimer un mentor
export const deleteMentor = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Récupérer tous les mentors pour l'administration
export const getAllMentorsForAdmin = async (): Promise<Mentor[]> => {
  const response = await axios.get<Mentor[]>('/admin/mentors');
  return response.data;
};

// Supprimer un mentor par ID pour l'administration
export const deleteMentorById = async (id: string): Promise<void> => {
  await axios.delete(`/admin/mentors/${id}`);
};

// Mettre à jour la disponibilité d'un mentor
export const updateMentorAvailability = async (id: string, available: boolean): Promise<Mentor> => {
  const response = await axios.patch<Mentor>(`${API_URL}/${id}/availability`, { available });
  return response.data;
};

// Récupérer les mentors par expertise
export const getMentorsByExpertise = async (expertise: string): Promise<Mentor[]> => {
  const response = await axios.get<Mentor[]>(`${API_URL}/expertise/${expertise}`);
  return response.data;
};

// Récupérer les mentors disponibles
export const getAvailableMentors = async (data: { expertise: string[] }): Promise<Mentor[]> => {
  const response = await axios.get<Mentor[]>(`${API_URL}/available`, { params: data });
  return response.data;
};

// Récupérer les mentors par nom
export const getMentorsByName = async (name: string): Promise<Mentor[]> => {
  const response = await axios.get<Mentor[]>(`${API_URL}/search`, { params: { name } });
  return response.data;
};


 




