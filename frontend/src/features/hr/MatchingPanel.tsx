import { useEffect, useState } from 'react';
import { getUnmatchedInterns, getAvailableMentors, assignMentorToIntern } from '@api/rh.api';
import { User } from '@api/admin.api';

export default function MatchingPanel() {
  const [interns, setInterns] = useState<User[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<string>('');

  useEffect(() => {
    getUnmatchedInterns().then(apiInterns => {
      setInterns(apiInterns.map((i: any) => ({
        _id: i._id,
        name: i.name ?? `${i.firstName ?? ''} ${i.lastName ?? ''}`.trim(),
        firstName: i.firstName ?? i.name?.split(' ')[0] ?? '',
        lastName: i.lastName ?? i.name?.split(' ')[1] ?? '',
        email: i.email,
        role: i.role as 'admin' | 'mentor' | 'intern' | 'hr',
        isActive: i.isActive ?? true,
        avatar: i.avatar,
        bio: i.bio,
        emailVerified: i.emailVerified,
        createdAt: i.createdAt ?? '',
        updatedAt: i.updatedAt ?? '',
      })));
    });
    getAvailableMentors().then(apiMentors => {
      setMentors(apiMentors.map((m: any) => ({
        _id: m._id,
        name: m.name ?? `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim(),
        firstName: m.firstName ?? m.name?.split(' ')[0] ?? '',
        lastName: m.lastName ?? m.name?.split(' ')[1] ?? '',
        email: m.email,
        role: m.role as 'admin' | 'mentor' | 'intern' | 'hr',
        isActive: m.isActive ?? true,
        avatar: m.avatar,
        bio: m.bio,
        emailVerified: m.emailVerified,
        createdAt: m.createdAt ?? '',
        updatedAt: m.updatedAt ?? '',
      })));
    });
  }, []);

  const handleMatch = () => {
    if (selectedIntern && selectedMentor) {
      assignMentorToIntern(selectedIntern, selectedMentor).then(() => {
        alert('Affectation réussie');
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold">Affecter un mentor à un stagiaire</h2>

      <div className="flex gap-4">
        <select onChange={e => setSelectedIntern(e.target.value)} className="select">
          <option>Choisir un stagiaire</option>
          {interns.map(i => (
            <option key={i._id} value={i._id}>{i.name}</option>
          ))}
        </select>

        <select onChange={e => setSelectedMentor(e.target.value)} className="select">
          <option>Choisir un mentor</option>
          {mentors.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={handleMatch}>Assigner</button>
      </div>
    </div>
  );
}
