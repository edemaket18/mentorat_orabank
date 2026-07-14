import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const InternNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get<Notification[]>('/api/intern/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Erreur de chargement des notifications :', error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Notifications</h2>
      <ul className="space-y-3">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-3 border rounded-md shadow-sm ${
              notif.read ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            <p className="text-sm text-gray-800">{notif.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternNotifications;
