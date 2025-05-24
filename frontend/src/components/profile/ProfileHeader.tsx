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
        <div className="text-lg font-medium">{name || 'User'}</div>
      </div>
      <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 capitalize">
        {role}
      </div>
    </div>
  );
}
