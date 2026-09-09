import React from 'react';

interface OrabankBrandProps {
  compact?: boolean;
  className?: string;
}

const OrabankBrand: React.FC<OrabankBrandProps> = ({ compact = false, className = '' }) => (
  <span className={`orabank-brand${compact ? ' orabank-brand--compact' : ''}${className ? ` ${className}` : ''}`}>
    <img
      className="orabank-brand__logo"
      src="https://www.orabank.net/sites/default/files/2023-11/Logo%20Orabank%20Togo%20copie.jpg"
      alt="Orabank Togo"
    />
    <span className="orabank-brand__name">
      <strong className="sr-only">Orabank Togo</strong>
      {!compact && <small>Togo · Mentorat</small>}
    </span>
  </span>
);

export default OrabankBrand;
