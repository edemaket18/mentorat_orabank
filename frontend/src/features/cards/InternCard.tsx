 import React from 'react';
import { Intern } from '@api/intern.api';
import { Card, CardContent } from '@components/layout/Card';
import { Mail, User, Calendar, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@components/common/Button';
import { useNavigate } from 'react-router-dom';

interface InternCardProps {
  intern: Intern;
}

export const InternCard: React.FC<InternCardProps> = ({ intern }) => {
  const navigate = useNavigate();

  const isOnline = intern.status === 'online';   

  return (
    <Card className="p-4 w-full sm:w-[350px] shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
      <div className="flex flex-col items-center text-center space-y-3 relative">
        {/* Avatar avec badge */}
        <div className="relative">
          <img
            src={intern.avatar || '/assets/default-avatar.png'}
            alt={intern.name}
            className="w-20 h-20 rounded-full object-cover border"
          />
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{intern.name}</h3>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <User className="w-4 h-4 mr-1" /> {intern.field || 'Non spécifié'}
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center justify-center">
            <Mail className="w-4 h-4 mr-1" /> {intern.email}
          </p>
          <p className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" /> {intern.startDate} - {intern.endDate}
          </p>
        </div>

        <div className="flex gap-2 pt-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/interns/${intern._id}`)}
          >
            <Eye className="w-4 h-4 mr-1" /> Voir Profil
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/chat/${intern._id}`)}
          >
            <MessageCircle className="w-4 h-4 mr-1" /> Message
          </Button>
        </div>
      </div>
    </Card>
  );
};
