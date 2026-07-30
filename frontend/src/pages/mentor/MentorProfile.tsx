import React from 'react';
import ProfileView from '@features/profile/ProfileView';

const MentorProfile: React.FC = () => (
  <div className="p-6">
    <ProfileView roleLabel="Mentor" roleColor="#16a34a" fields={['bio', 'phone', 'department']} />
  </div>
);

export default MentorProfile;