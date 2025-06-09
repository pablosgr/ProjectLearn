import type { ReactNode } from 'react';

interface ProfileCardProps {
  children: ReactNode;
}

export default function ProfileCard({ children }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-14">
      {children}
    </div>
  );
}
