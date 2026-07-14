import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export const Checkbox = ({ checked, onCheckedChange, label }: CheckboxProps) => {
  return (
    <div className="kool-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="kool-checkbox-input"
      />
      <span className="kool-checkbox-label">{label}</span>
    </div>
  );
};

export default Checkbox;
