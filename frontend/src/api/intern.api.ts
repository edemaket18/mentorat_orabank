 import httpClient from './httpClient';

const API_URL = '/intern';
 
 
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

export interface InternDashboardData {
  name: string;
  currentMentor: {
    id: string;
    name: string;
    expertise: string;
    email: string;
    available: boolean;
  } | null;
  mentorshipProgress: number;
  lastReport: { title: string; status: string; submittedAt: string } | null;
}

export const getInternDashboard = async (): Promise<InternDashboardData> => {
  const response = await httpClient.get<InternDashboardData>(`${API_URL}/dashboard`);
  return response.data;
};

export interface MatchingMentor {
  id: string;
  name: string;
  expertise: string;
  company: string;
  available: boolean;
  requested: boolean;
}

export const getMentorsForMatching = async (): Promise<MatchingMentor[]> => {
  const response = await httpClient.get<MatchingMentor[]>(`${API_URL}/mentors`);
  return response.data;
};

export const requestMentor = async (mentorId: string): Promise<void> => {
  await httpClient.post(`${API_URL}/matching-requests`, { mentorId });
};

export interface InternTask {
  _id: string;
  title: string;
  completed: boolean;
  assignedDate: string;
}

export const getMyTasks = async (): Promise<InternTask[]> => {
  const response = await httpClient.get<InternTask[]>(`${API_URL}/tasks`);
  return response.data;
};

export const toggleTask = async (id: string): Promise<InternTask> => {
  const response = await httpClient.patch<InternTask>(`${API_URL}/tasks/${id}/toggle`);
  return response.data;
};

export interface ChatMessage {
  from: 'me' | 'mentor';
  content: string;
  timestamp: string;
}

export const getMyMessages = async (): Promise<ChatMessage[]> => {
  const response = await httpClient.get<ChatMessage[]>(`${API_URL}/messages`);
  return response.data;
};

export const sendMyMessage = async (content: string): Promise<ChatMessage> => {
  const response = await httpClient.post<ChatMessage>(`${API_URL}/messages`, { content });
  return response.data;
};

export interface InternReport {
  _id: string;
  title: string;
  introduction?: string;
  status: 'draft' | 'submitted' | 'validated' | 'rejected';
  createdAt: string;
}

export const getMyReports = async (): Promise<InternReport[]> => {
  const response = await httpClient.get<InternReport[]>('/reports');
  return response.data;
};

export const createAndSubmitReport = async (title: string, introduction: string): Promise<InternReport> => {
  const created = await httpClient.post<InternReport>('/reports', { title, introduction });
  const submitted = await httpClient.put<InternReport>(`/reports/${created.data._id}/submit`, {});
  return submitted.data;
};