import { useEffect, useState } from 'react';
import { useUserData } from '../context/UserContext.tsx';
import type { StudentClassroomsResponse } from '../types/student-classrooms-type';
import type { ClassroomsType } from '../types/classroom-type.d.ts';
import ClassroomCard from '../components/classroom/ClassroomCard.tsx';
import CreateClassModal from '../components/classroom/ClassroomModal.tsx';
import { Plus } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import SearchBar from '../components/ui/Searchbar.tsx';

export default function Classroom() {
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [studentClassrooms, setStudentClassrooms] = useState<StudentClassroomsResponse>([]);
  const [teacherClassrooms, setTeacherClassrooms] = useState<ClassroomsType>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getStudentClasses = async () => {
    try {
      const response = await fetch('/php/classroom/student_get_classrooms.php', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();

      if (data.error) {
        setStudentClassrooms([]);
        throw new Error(data.error);
      }

      setStudentClassrooms(data);
    } catch (error) {
      console.error('Error fetching student classes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getTeacherClasses = async () => {
    try {
      const response = await fetch('/php/classroom/teacher_get_classrooms.php', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();

      if (data.error) {
        setTeacherClassrooms([]);
        throw new Error(data.error);
      }

      setTeacherClassrooms(data.classrooms);
    } catch (error) {
      console.error('Error fetching student classes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getAdminClasses = async () => {
    try {
      const response = await fetch('/php/classroom/get_all_classrooms.php', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();

      if (data.error) {
        setTeacherClassrooms([]);
        throw new Error(data.error);
      }

      setTeacherClassrooms(data.classrooms);
    } catch (error) {
      console.error('Error fetching all classrooms:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (userData?.role === 'teacher') {
        await getTeacherClasses();
      } else if (userData?.role === 'admin') {
        await getAdminClasses();
      } else {
        await getStudentClasses();
      }
    };
    
    if (userData) {
      fetchClassrooms();
    }
  }, [userData]);

  const handleClassroomDelete = async (deletedId: string) => {
    try {
      const response = await fetch('/php/classroom/remove_classroom.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletedId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete classroom');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (teacherClassrooms) {
        setTeacherClassrooms(prevClassrooms =>
          prevClassrooms && prevClassrooms.filter(classroom => classroom.id !== deletedId)
        );
      }
    } catch (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  };

  const filteredTeacherClassrooms = teacherClassrooms?.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudentClassrooms = studentClassrooms?.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container h-full mx-auto py-8">
      <div className="flex justify-between flex-wrap gap-6 items-center mb-8">
        <h1 className="text-3xl font-bold">{userData?.role === 'admin' ? 'Classrooms Management' : 'My Classrooms'}</h1>
      </div>

      <div className="mb-10 flex flex-row flex-wrap-reverse gap-5">
        <SearchBar
          placeholder="Search by name or teacher..."
          onSearch={setSearchQuery}
        />
        {userData?.role === 'teacher' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-cyan-600 text-white font-medium flex flex-row gap-3 py-2 px-3 rounded-lg hover:bg-cyan-700 transition-colors hover:cursor-pointer"
          >
            <Plus strokeWidth={3}/>
            New Class
          </button>
        )}
      </div>

      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          getTeacherClasses(); // Refresh the list after creating class
        }}
      />

      {isLoading ? (
        <section className="flex h-full justify-center items-center">
          <div className="text-gray-600 pt-10 flex flex-col items-center gap-4">
            <LoaderCircle className="animate-spin" color='#5d8297' size={45} />
            <span className='text-[#5d8297] text-lg font-medium'>Loading classrooms...</span>
          </div>
        </section>
      ) : (
        <div className="space-y-8">
          {filteredTeacherClassrooms && filteredTeacherClassrooms.length > 0 && (
            <section className="flex flex-row flex-wrap gap-10">
              {filteredTeacherClassrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  id={classroom.id}
                  name={classroom.name}
                  teacherUsername={classroom.teacher_name}
                  onDelete={handleClassroomDelete}
                />
              ))}
            </section>
          )}

          {filteredStudentClassrooms && filteredStudentClassrooms.length > 0 && (
            <section className="flex flex-row flex-wrap gap-10">
                {filteredStudentClassrooms.map((classroom) => (
                  <ClassroomCard
                    key={classroom.id}
                    id={classroom.id}
                    name={classroom.name}
                    teacherUsername={classroom.teacher.name}
                  />
                ))}
            </section>
          )}
          
          {(!filteredStudentClassrooms?.length && !filteredTeacherClassrooms?.length) && (
            <p className="text-[#5d8297] pt-15 text-lg font-medium text-center">
              {searchQuery ? 'No classrooms match your search.' : 'No classrooms found.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
