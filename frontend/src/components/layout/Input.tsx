// 📥 Input.tsx
import React from 'react';

interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  Input?: React.ReactNode;  
}

export const Input = ({ id = '', label, type = 'text', name, value, onChange, placeholder, className = '', disabled, Input }: InputProps) => {
  return (
    <div className="kool-form-group">
      {label && <label htmlFor={name} className="kool-label">{label}</label>}
      {Input ? (
        <div className="kool-input-wrapper">
          {Input}
        </div>
      ) : (
        <input
          id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`kool-input ${className}`}
      />
      )}
      {disabled && <span className="kool-input-disabled">Désactivé</span>}
    </div>
  );
};

export default Input;