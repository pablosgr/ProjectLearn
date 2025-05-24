interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  fallback?: string;
}

export default function ProfileField({ label, value, fallback = 'Not set' }: ProfileFieldProps) {
  return (
    <div className="grid grid-cols-3 py-3 border-b border-gray-100">
      <div className="text-sm font-medium text-neutral-600">{label}:</div>
      <div className="col-span-2">{value || fallback}</div>
    </div>
  );
}
