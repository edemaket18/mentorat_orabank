import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { toast } from 'react-hot-toast';
import {
  getMySessions,
  scheduleSession,
  updateSessionStatus,
  getMyInterns,
  MentorSession,
  MentorInternSummary,
} from '@api/mentor.api';

const statusLabels: Record<string, string> = {
  scheduled: 'Planifiée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const statusColors: Record<string, string> = {
  scheduled: 'text-green-600',
  completed: 'text-gray-500',
  cancelled: 'text-red-500',
};

const MentorSessions: React.FC = () => {
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [interns, setInterns] = useState<MentorInternSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ menteeId: '', scheduledAt: '', durationMinutes: 60, notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getMySessions().then(setSessions).catch(console.error);
    getMyInterns().then(setInterns).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSchedule = async () => {
    if (!form.menteeId || !form.scheduledAt) {
      toast.error('Choisissez un stagiaire et une date.');
      return;
    }
    setSubmitting(true);
    try {
      await scheduleSession({
        menteeId: form.menteeId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: Number(form.durationMinutes) || 60,
        notes: form.notes,
      });
      toast.success('Session planifiée.');
      setForm({ menteeId: '', scheduledAt: '', durationMinutes: 60, notes: '' });
      load();
    } catch (error) {
      toast.error('Erreur lors de la planification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      await updateSessionStatus(id, status);
      load();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planifier une session</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <select
            className="border rounded px-2 py-2"
            value={form.menteeId}
            onChange={(e) => setForm({ ...form, menteeId: e.target.value })}
          >
            <option value="">Stagiaire...</option>
            {interns.map((i) => (
              <option key={i.intern?._id} value={i.intern?._id}>{i.intern?.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            className="border rounded px-2 py-2"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-2 py-2"
            placeholder="Durée (min)"
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
          />
          <button
            onClick={handleSchedule}
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Planifier
          </button>
          <input
            type="text"
            className="border rounded px-2 py-2 md:col-span-4"
            placeholder="Note (optionnel)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes Sessions de Mentorat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : sessions.length === 0 ? (
            <p className="text-center text-gray-500">Aucune session planifiée pour le moment.</p>
          ) : (
            sessions.map((s) => (
              <div key={s._id} className="border rounded-md p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.mentee?.name ?? 'Stagiaire'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(s.scheduledAt).toLocaleString()} — {s.durationMinutes} min
                  </p>
                  {s.notes && <p className="text-sm text-gray-500">{s.notes}</p>}
                  <p className={`text-sm font-medium ${statusColors[s.status]}`}>{statusLabels[s.status]}</p>
                </div>
                {s.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(s._id, 'completed')}
                      className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
                    >
                      Marquer terminée
                    </button>
                    <button
                      onClick={() => handleStatusChange(s._id, 'cancelled')}
                      className="text-sm border rounded px-3 py-1 hover:bg-gray-50 text-red-500"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorSessions;