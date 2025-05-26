import type { FC } from 'react';

interface ClassroomCardProps {
  name: string;
  teacherUsername: string;
}

const ClassroomCard: FC<ClassroomCardProps> = ({ name, teacherUsername }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="bg-cyan-600 text-white p-6 h-32 flex items-end">
        <h2 className="text-xl font-medium line-clamp-2">{name}</h2>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm h-10">Teacher: {teacherUsername}</p>
      </div>
    </div>
  );
};

export default ClassroomCard;
