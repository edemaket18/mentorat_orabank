 import httpClient from './httpClient';

import { Intern } from '@api/intern.api';

const API_URL = '/mentors';

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
  const response = await httpClient.get<MentorStatsResponse>(`${API_URL}/stats`);
  return response.data;
};

export const getMentorReview = async (): Promise<MentorReview> => {
  const response = await httpClient.get<MentorReview>(`${API_URL}/reviews`);
  return response.data;
};

// Récupérer les stagiaires assignés à un mentor
export const getAssignedInterns = async (mentorId: string): Promise<Intern[]> => {
  const response = await httpClient.get<Intern[]>(`${API_URL}/${mentorId}/interns`);
  return response.data;
};

// Récupérer tous les mentors
export const getMentors = async (): Promise<Mentor[]> => {
  const response = await httpClient.get<Mentor[]>(API_URL);
  return response.data;
};

// Récupérer un mentor par ID
export const getMentorById = async (id: string): Promise<Mentor> => {
  const response = await httpClient.get<Mentor>(`${API_URL}/${id}`);
  return response.data;
};

// Créer un nouveau mentor
export const createMentor = async (mentor: Omit<Mentor, '_id'>): Promise<Mentor> => {
  const response = await httpClient.post<Mentor>(API_URL, mentor);
  return response.data;
};

// Mettre à jour un mentor existant
export const updateMentor = async (id: string, mentor: Partial<Mentor>): Promise<Mentor> => {
  const response = await httpClient.put<Mentor>(`${API_URL}/${id}`, mentor);
  return response.data;
};

// Supprimer un mentor
export const deleteMentor = async (id: string): Promise<void> => {
  await httpClient.delete(`${API_URL}/${id}`);
};

// Récupérer tous les mentors pour l'administration
export const getAllMentorsForAdmin = async (): Promise<Mentor[]> => {
  const response = await httpClient.get<Mentor[]>('/admin/mentors');
  return response.data;
};

// Supprimer un mentor par ID pour l'administration
export const deleteMentorById = async (id: string): Promise<void> => {
  await httpClient.delete(`/admin/mentors/${id}`);
};

// Mettre à jour la disponibilité d'un mentor
export const updateMentorAvailability = async (id: string, available: boolean): Promise<Mentor> => {
  const response = await httpClient.patch<Mentor>(`${API_URL}/${id}/availability`, { available });
  return response.data;
};

// Récupérer les mentors par expertise
export const getMentorsByExpertise = async (expertise: string): Promise<Mentor[]> => {
  const response = await httpClient.get<Mentor[]>(`${API_URL}/expertise/${expertise}`);
  return response.data;
};

// Récupérer les mentors disponibles
export const getAvailableMentors = async (data: { expertise: string[] }): Promise<Mentor[]> => {
  const response = await httpClient.get<Mentor[]>(`${API_URL}/available`, { params: data });
  return response.data;
};

// Récupérer les mentors par nom
export const getMentorsByName = async (name: string): Promise<Mentor[]> => {
  const response = await httpClient.get<Mentor[]>(`${API_URL}/search`, { params: { name } });
  return response.data;
};

export interface MentorStatistics {
  activeInterns: number;
  completedMentorships: number;
  feedbackGiven: number;
}

// Récupérer les statistiques du mentor connecté
export const getMyMentorStatistics = async (): Promise<MentorStatistics> => {
  const response = await httpClient.get<MentorStatistics>(`${API_URL}/me/statistics`);
  return response.data;
};

export interface MentorInternSummary {
  matchId: string;
  intern: { _id: string; name: string; email: string } | null;
  startedAt: string;
  goals: string[];
  progress: string;
}

export const getMyInterns = async (): Promise<MentorInternSummary[]> => {
  const response = await httpClient.get<MentorInternSummary[]>(`${API_URL}/me/interns`);
  return response.data;
};

export interface MentorMentorshipSummary {
  _id: string;
  intern: { _id: string; name: string; email: string } | null;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  startedAt: string;
  endedAt?: string;
}

export const getMyMentorships = async (): Promise<MentorMentorshipSummary[]> => {
  const response = await httpClient.get<MentorMentorshipSummary[]>(`${API_URL}/me/mentorships`);
  return response.data;
};

export const endMentorship = async (id: string): Promise<void> => {
  await httpClient.patch(`${API_URL}/me/mentorships/${id}/end`);
};

export const getMyDepartures = async (): Promise<MentorMentorshipSummary[]> => {
  const response = await httpClient.get<MentorMentorshipSummary[]>(`${API_URL}/me/departures`);
  return response.data;
};

export interface MentorCandidate {
  _id: string;
  name: string;
  email: string;
  department?: string;
  university?: string;
}

export const getAvailableCandidates = async (): Promise<MentorCandidate[]> => {
  const response = await httpClient.get<MentorCandidate[]>(`${API_URL}/me/candidates`);
  return response.data;
};

export interface MentorReportSummary {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  intern: { _id: string; name: string; email: string } | null;
}

export const getMyMentorReports = async (): Promise<MentorReportSummary[]> => {
  const response = await httpClient.get<MentorReportSummary[]>(`${API_URL}/me/reports`);
  return response.data;
};

export interface MentorEvaluationSummary {
  _id: string;
  intern: { _id: string; name: string; email: string } | null;
  score: number;
  comment?: string;
  createdAt: string;
}

export const getMyEvaluations = async (): Promise<MentorEvaluationSummary[]> => {
  const response = await httpClient.get<MentorEvaluationSummary[]>(`${API_URL}/me/evaluations`);
  return response.data;
};

export const createEvaluation = async (intern: string, score: number, comment?: string): Promise<void> => {
  await httpClient.post(`${API_URL}/me/evaluations`, { intern, score, comment });
};