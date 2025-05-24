import type { ChangeEvent } from "react";

interface EditableFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function EditableField({ id, label, value, onChange }: EditableFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">✏️</span>
      </div>
    </div>
  );
}
