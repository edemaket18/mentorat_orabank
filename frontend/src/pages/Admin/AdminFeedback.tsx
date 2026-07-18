 import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { MessageCircle } from 'lucide-react';
import { getAllFeedback, Feedback } from '@api/feedback.api';

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    getAllFeedback().then(setFeedbacks).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle><MessageCircle className="inline mr-2" /> Retours utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="border rounded-md p-4">
              <p className="font-semibold">{fb.author?.name ?? 'Utilisateur'}</p>
              <p className="text-gray-700">{fb.message}</p>
              <p className="text-sm text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</p>
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