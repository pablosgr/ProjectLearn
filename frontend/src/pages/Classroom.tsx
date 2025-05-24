import { useEffect, useState } from 'react';
import { useUserData } from '../context/UserContext.tsx';
import type { StudentClassroomsResponse } from '../types/student-classrooms-type';

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
    <>
      <h1>Classrooms</h1>
      {isLoading ? (
        <div className="loading-state">
          <p>Loading classrooms...</p>
        </div>
      ) : (
        <div className="classrooms-content">
          {studentClassrooms && studentClassrooms.length > 0 ? (
            <ul>
              {studentClassrooms.map((classroom) => (
                <li key={classroom.id}>{classroom.name}</li>
              ))}
            </ul>
          ) : (
            <p>No classrooms found.</p>
          )}
        </div>
      )}
    </>
  )
}
