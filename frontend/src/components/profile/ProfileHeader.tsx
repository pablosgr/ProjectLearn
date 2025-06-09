import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  name: string | null | undefined;
  role: string | null | undefined;
}

export default function ProfileHeader({ name, role }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <ProfileAvatar name={name} />
        <div className="text-lg font-medium text-neutral-700">{name}</div>
      </div>
      <div className="bg-neutral-300 px-4 py-2 rounded-full text-sm font-medium text-neutral-700 capitalize select-none">
        {role}
      </div>
    </div>
  );
}
