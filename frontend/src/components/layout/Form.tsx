// 📝 Form.tsx
import React from 'react';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

const Form = ({ children, onSubmit, className = '' }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={`kool-form ${className}`}>
      {children}
    </form>
  );
};

export default Form;