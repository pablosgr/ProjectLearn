import { useEffect, useState } from 'react';
import { useUserData } from '../context/UserContext.tsx';
import type { StudentClassroomsResponse } from '../types/student-classrooms-type';
import ClassroomCard from '../components/classroom/ClassroomCard.tsx';

export default function Classroom() {
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [studentClassrooms, setStudentClassrooms] = useState<StudentClassroomsResponse | null>(null);

  const getStudentClasses = async () => {
    console.log('Fetching student classes...');
    try {
      const response = await fetch('/php/user/student_get_classrooms.php', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      setStudentClassrooms(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching student classes:', error);
    }
  }

  const getTeacherClasses = async () => {
    try {
      const response = await fetch('/php/user/student_get_classrooms.php', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }
    } catch (error) {
      console.error('Error fetching student classes:', error);
    }
  }

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (userData?.role === 'teacher') {
        await getTeacherClasses();
      } else {
        await getStudentClasses();
      }
    };
    
    if (userData) {
      fetchClassrooms();
    }
  }, [userData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Classrooms</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600">Loading classrooms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentClassrooms && studentClassrooms.length > 0 ? (
            studentClassrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                name={classroom.name}
                teacherUsername={classroom.teacher.name}
              />
            ))
          ) : (
            <p className="text-gray-600">No classrooms found.</p>
          )}
        </div>
      )}
    </div>
  );
}
