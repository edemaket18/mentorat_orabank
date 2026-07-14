// src/components/cards/MentorCard.tsx

import React from 'react';

 
 

type MentorCardProps = {
  mentor: {
    id: string;
    name: string;
    expertise: string;
    company: string;
    available: boolean;
  };
  id: string;
name: string;
expertise: string;
company: string;
available: boolean;
  onRequest: () => void;
  disabled?: boolean;
  requested?: boolean;
};

export const MentorCard: React.FC<MentorCardProps> = ({  id,
name,
expertise,
company,
available,
onRequest,
disabled,
requested
}) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{expertise}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{company}</p>
      <button
        onClick={onRequest}
        disabled={disabled}
        className={`mt-2 px-4 py-1 rounded text-white ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {requested ? 'Demande envoyée' : 'Demander'}
      </button>
    </div>
  );
};


export default MentorCard;
