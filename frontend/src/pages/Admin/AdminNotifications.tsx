import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Bell } from 'lucide-react';

const notifications = [
  {
    id: 1,
    message: 'Nouvelle demande de mentorat reçue.',
    date: '2025-07-17 10:30',
  },
  {
    id: 2,
    message: 'Un signalement a été traité.',
    date: '2025-07-17 08:15',
  },
];

const AdminNotifications: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle><Bell className="inline mr-2" /> Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="border p-4 rounded-md">
              <p className="font-medium">{notif.message}</p>
              <p className="text-sm text-gray-500">{notif.date}</p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-muted-foreground text-center">Aucune notification récente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
