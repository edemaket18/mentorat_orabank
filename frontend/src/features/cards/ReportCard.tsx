// src/components/cards/ReportCard.tsx

import React from 'react';

interface ReportCardProps {
  title: string;
  status: 'en attente' | 'validé' | 'rejeté';
  createdAt: string;
  onView: () => void;
  report?: {
    title: string;
    status: string;
    submittedAt: string;
  };
}

const statusColors = {
  validé: 'text-green-600',
  rejeté: 'text-red-600',
  'en attente': 'text-yellow-600',
};

const ReportCard: React.FC<ReportCardProps> = ({ title, status, createdAt, onView, report }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold dark:text-white">{title}</h3>
        <span className={`text-sm font-medium ${statusColors[status]}`}>{status}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{createdAt}</p>
      <button
        onClick={onView}
        className="text-blue-500 hover:underline text-sm mt-2"
      >
        Voir le rapport
      </button>
    </div>
  );
};

export default ReportCard;
