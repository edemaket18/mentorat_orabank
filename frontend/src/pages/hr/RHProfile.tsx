import React from 'react';
import ProfileView from '@features/profile/ProfileView';

const RHProfile: React.FC = () => (
  <div className="p-6">
    <ProfileView roleLabel="Ressources Humaines" roleColor="#0891b2" fields={['bio', 'phone', 'department']} />
  </div>
);

export default RHProfile;