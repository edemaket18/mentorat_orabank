import httpClient from './httpClient';

export interface ModerationReport {
  _id: string;
  reason: string;
  createdAt: string;
  status: 'open' | 'in_progress' | 'closed';
  message: {
    _id: string;
    content: string;
    sender: { name: string; email: string };
  };
}

export const getAllModerationReports = async (): Promise<ModerationReport[]> => {
  const response = await httpClient.get<ModerationReport[]>('/moderation-reports');
  return response.data;
};

export const resolveModerationReport = async (id: string): Promise<void> => {
  await httpClient.post(`/moderation-reports/${id}/resolve`);
};

export const deleteModerationReportMessage = async (id: string): Promise<void> => {
  await httpClient.delete(`/moderation-reports/${id}/message`);
};