 import React, { useState } from 'react';
import { createFeedback } from '@api/feedback.api';

const MentorFeedback: React.FC = () => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createFeedback(message);
      setMessage('');
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du retour.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Retour d'expérience</h1>
      <p className="text-gray-700">Partagez votre avis ou vos suggestions sur la plateforme.</p>

      <div className="mt-6">
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mt-2"
          rows={4}
          placeholder="Écrivez votre retour ici..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={submitting || !message.trim()}
        >
          {submitting ? 'Envoi...' : 'Envoyer'}
        </button>
        {sent && <p className="text-green-600 text-sm mt-2">Merci, votre retour a bien été envoyé.</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default MentorFeedback;