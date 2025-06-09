import type { ChangeEvent } from "react";
import { PenLine } from 'lucide-react';

interface EditableFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function EditableField({ id, label, value, onChange }: EditableFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-md font-medium text-neutral-700 mb-2">
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
          className="
            w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2
            focus:ring-cyan-600 focus:border-cyan-600 text-cyan-700
          "
        />
        <span className="absolute right-3 top-2.5">
          <PenLine color="#a3a3a3" size={22} />
        </span>
      </div>
    </div>
  );
}
