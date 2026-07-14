import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { MessageCircle } from 'lucide-react';

const feedbacks = [
  {
    id: '1',
    user: 'Koffi E.',
    content: 'Plateforme très utile pour le suivi de stage.',
    date: '2025-07-16',
  },
  {
    id: '2',
    user: 'Ama A.',
    content: 'Interface claire et facile à utiliser.',
    date: '2025-07-15',
  },
];

const AdminFeedback: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle><MessageCircle className="inline mr-2" /> Retours utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="border rounded-md p-4">
              <p className="font-semibold">{fb.user}</p>
              <p className="text-gray-700">{fb.content}</p>
              <p className="text-sm text-gray-500">{fb.date}</p>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <p className="text-center text-muted-foreground">Aucun retour pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeedback;
