import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Bell } from 'lucide-react';

const MentorNotifications: React.FC = () => {
  const notifications = [
    { id: 1, message: 'Vous avez été assigné à un nouveau stagiaire.', date: '2025-07-16' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader><CardTitle><Bell className="inline mr-2" /> Notifications Mentor</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="border p-4 rounded-md">
              <p className="font-medium">{n.message}</p>
              <p className="text-sm text-gray-500">{n.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorNotifications;
