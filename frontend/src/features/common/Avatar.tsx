import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  name?: string;
}

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40, name }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size / 2,
        color: '#555',
        overflow: 'hidden',
      }}
      title={alt || name}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
