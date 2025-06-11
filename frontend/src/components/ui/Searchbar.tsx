interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder, onSearch, className }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      className={`
        w-full max-w-md px-4 py-2
        border border-neutral-400 rounded-lg
        text-neutral-800
        focus:outline-none focus:ring-2 focus:ring-cyan-500
        placeholder:text-neutral-400
        ${className}
      `}
    />
  );
}
