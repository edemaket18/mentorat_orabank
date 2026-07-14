import React, { useEffect, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Rapport de stage soumis',
    description: 'Le stagiaire Emmanuel a soumis son rapport.',
    date: '2025-07-16',
    read: false,
  },
  {
    id: '2',
    title: 'Nouveau mentor assigné',
    description: 'Mentor Julie a été assignée à un stagiaire.',
    date: '2025-07-15',
    read: true,
  },
];

const RHNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
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
              key={notif.id}
              className={`p-4 rounded shadow-sm ${
                notif.read ? 'bg-gray-100' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{notif.title}</h3>
                  <p className="text-gray-700">{notif.description}</p>
                  <p className="text-sm text-gray-400">{notif.date}</p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
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
