 import React, { useEffect, useState } from 'react';
import { getMyNotifications, markNotificationAsRead, Notification } from '@api/notification.api';

const RHNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getMyNotifications().then(setNotifications).catch(console.error);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded shadow-sm ${
                notif.read ? 'bg-gray-100' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{notif.title}</h3>
                  <p className="text-gray-700">{notif.message}</p>
                  <p className="text-sm text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="text-blue-600 text-sm underline"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RHNotifications;