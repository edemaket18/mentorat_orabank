import React from 'react';

interface RoleBadgeProps {
  role: string;
}

const getBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return '#d32f2f';
    case 'mentor':
      return '#1976d2';
    case 'intern':
      return '#388e3c';
    case 'rh':
      return '#fbc02d';
    default:
      return '#757575';
  }
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '0.25em 0.75em',
      borderRadius: '12px',
      background: getBadgeColor(role),
      color: '#fff',
      fontWeight: 500,
      fontSize: 14,
      textTransform: 'capitalize',
    }}
  >
    {role}
  </span>
);

export default RoleBadge;
