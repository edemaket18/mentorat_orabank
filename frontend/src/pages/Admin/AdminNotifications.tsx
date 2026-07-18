 import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Bell } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead, Notification } from '@api/notification.api';

const AdminNotifications: React.FC = () => {
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
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle><Bell className="inline mr-2" /> Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`border p-4 rounded-md cursor-pointer ${notif.read ? '' : 'bg-blue-50'}`}
              onClick={() => !notif.read && handleMarkAsRead(notif._id)}
            >
              <p className="font-medium">{notif.message}</p>
              <p className="text-sm text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
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