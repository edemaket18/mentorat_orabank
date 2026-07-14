import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast'; // Ajout de la propriété speed
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'blue', speed = 'normal' }) => {
  let spinnerSizeClass = 'w-6 h-6';
  let animationSpeedClass = 'animate-spin'; // Vitesse par défaut

  switch (size) {
    case 'sm':
      spinnerSizeClass = 'w-4 h-4';
      break;
    case 'lg':
      spinnerSizeClass = 'w-8 h-8';
      break;
    default:
      spinnerSizeClass = 'w-6 h-6';
  }

  switch (speed) {
    case 'slow':
      animationSpeedClass = 'animate-spin-slow'; // Classe à définir dans le CSS
      break;
    case 'fast':
      animationSpeedClass = 'animate-spin-fast'; // Classe à définir dans le CSS
      break;
    default:
      animationSpeedClass = 'animate-spin';
  }

  return (
    <div className={`rounded-full border-t-2 border-${color}-500 border-solid ${spinnerSizeClass} ${animationSpeedClass}`}></div>
  );
};

export default Spinner;