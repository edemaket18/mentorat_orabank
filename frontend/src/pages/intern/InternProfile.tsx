import React from 'react';
import ProfileView from '@features/profile/ProfileView';

const InternProfile: React.FC = () => (
  <div className="p-6">
    <ProfileView roleLabel="Stagiaire" roleColor="#ea580c" fields={['bio', 'phone', 'department', 'university']} />
  </div>
);

export default InternProfile;