interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
}

export default function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="grid grid-cols-3 py-3 border-b border-neutral-300">
      <div className="text-md font-medium text-neutral-600">{label}:</div>
      <div className="col-span-2 text-cyan-700">{value}</div>
    </div>
  );
}
