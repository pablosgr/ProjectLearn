interface ProfileAvatarProps {
  name: string | null | undefined;
}

export default function ProfileAvatar({ name }: ProfileAvatarProps) {
  return (
    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
      {name?.charAt(0) || 'U'}
    </div>
  );
}
