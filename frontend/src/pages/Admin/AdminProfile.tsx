import React from 'react';
import ProfileView from '@features/profile/ProfileView';

const AdminProfile: React.FC = () => (
  <div className="p-6">
    <ProfileView roleLabel="Administrateur" roleColor="#7c3aed" fields={['bio', 'phone']} />
  </div>
);

export default AdminProfile;