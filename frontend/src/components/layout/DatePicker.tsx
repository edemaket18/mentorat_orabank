import React from 'react';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-3 py-2"
      />
    </div>
  );
};

export { DatePicker };