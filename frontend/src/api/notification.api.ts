import httpClient from './httpClient';

export interface Notification {
  _id: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await httpClient.get<Notification[]>('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const response = await httpClient.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await httpClient.patch('/notifications/read-all');
};