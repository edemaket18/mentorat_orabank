 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Bell } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead, Notification } from '@api/notification.api';

const MentorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getMyNotifications().then(setNotifications).catch(console.error);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader><CardTitle><Bell className="inline mr-2" /> Notifications Mentor</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`border p-4 rounded-md cursor-pointer ${n.read ? '' : 'bg-blue-50'}`}
              onClick={() => !n.read && handleMarkAsRead(n._id)}
            >
              <p className="font-medium">{n.message}</p>
              <p className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</p>
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

export default MentorNotifications;