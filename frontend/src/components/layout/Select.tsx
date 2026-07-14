import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children?: string | React.ReactNode;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, onValueChange, ...props }) => (
  <div className="flex flex-col">
    {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
    <select
      className="border rounded px-3 py-2"
      {...props}
    >
      {children}
    </select>
  </div>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
    {children}
  </div>
);

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value} className="px-4 py-2 hover:bg-gray-100">
    {children}
  </option>
);

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex items-center justify-between border rounded px-3 py-2 ${className}`}>
    {children}
  </div>
);

export const SelectValue: React.FC<{ children: React.ReactNode; placeholder?: string }> = ({ children, placeholder }) => (
  <span className="text-sm text-gray-600">{children || placeholder}</span>
);

export default Select;