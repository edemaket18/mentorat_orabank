import React from 'react';

type TextareaProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
};

export const Textarea = ({ label, name, value, onChange, placeholder, className = '', rows = 4 }: TextareaProps) => {
  return (
    <div className="kool-form-group">
      {label && <label htmlFor={name} className="kool-label">{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`kool-textarea ${className}`}
        rows={rows}
      />
    </div>
  );
};

export default Textarea;