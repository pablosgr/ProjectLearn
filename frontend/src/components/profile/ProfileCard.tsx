import type { ReactNode } from 'react';

interface ProfileCardProps {
  children: ReactNode;
}

export default function ProfileCard({ children }: ProfileCardProps) {
  return (
    <div className="bg-neutral-400 rounded-xl shadow-md p-14">
      {children}
    </div>
  );
}
