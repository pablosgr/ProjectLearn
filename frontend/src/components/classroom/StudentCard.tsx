import type { FC } from 'react';
import type { UserData } from '../../types/user-context-type';

const StudentCard: FC<{ student: UserData }> = ({ student }) => (
  <li className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="h-10 w-10 rounded-full bg-cyan-600 grid place-items-center">
      <span className="text-white font-medium">{student. name && student.name.charAt(0).toUpperCase()}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-900 truncate">{student.name}</h3>
      <p className="text-sm text-gray-500">@{student.username}</p>
    </div>
  </li>
);

export default StudentCard;
