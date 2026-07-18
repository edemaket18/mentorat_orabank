import httpClient from './httpClient';

export interface Feedback {
  _id: string;
  message: string;
  createdAt: string;
  author?: {
    _id: string;
    name: string;
    role: string;
  };
}

export const getAllFeedback = async (): Promise<Feedback[]> => {
  const response = await httpClient.get<Feedback[]>('/feedback');
  return response.data;
};

export const createFeedback = async (message: string): Promise<Feedback> => {
  const response = await httpClient.post<Feedback>('/feedback', { message });
  return response.data;
};