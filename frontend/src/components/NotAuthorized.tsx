import React from 'react';
import { Link } from 'react-router-dom';
import   Button   from './common/Button';  

const NotAuthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Accès refusé</h1>
      <p className="text-lg text-gray-700 mb-6">
        Vous n’avez pas la permission d’accéder à cette page.
      </p>
      <Link to="/">
        <Button>Retour à l’accueil</Button>
      </Link>
    </div>
  );
};

export default NotAuthorized;
