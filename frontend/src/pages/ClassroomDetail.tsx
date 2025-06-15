import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import ClassroomTests from '../components/classroom/ClassroomTests';
import ClassroomStudents from '../components/classroom/ClassroomStudents';
import ClassroomSettings from '../components/classroom/ClassroomSettings';
import type { ClassroomType } from '../types/classroom-type';
import { LoaderCircle } from 'lucide-react';

type Tab = 'tests' | 'students' | 'settings';

export default function ClassroomDetail() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useUserData();
  const [classroom, setClassroom] = useState<ClassroomType | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tests');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const response = await fetch(`/php/classroom/get_classroom.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch classroom details');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClassroom(data.classrooms[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!userData) return;

      try {
        // Check if, if teacher, they own the classroom
        if (userData.role === 'teacher') {
          setHasAccess(classroom?.teacher_id === userData.id);
          return;
        }

        if (userData.role === 'admin') {
          setHasAccess(true);
          return;
        }

        // Checks student enrollment
        if (userData.role === 'student') {
          const response = await fetch('/php/classroom/classroom_get_students.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) throw new Error('Failed to check enrollment');

          const students = await response.json();
          setHasAccess(students.some((student: any) => student.id === userData.id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify access');
        setHasAccess(false);
      } finally {
        setPageLoading(false);
      }
    };

    if (classroom) {
      checkAccess();
    }
  }, [classroom, userData, id]);

  const handleClassUpdate = (newName: string) => {
    setClassroom(prev => prev ? { ...prev, name: newName } : null);
  };

  if (isLoading) {
    return (
      <div className='w-full pt-20 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Loading classroom details..</p>
        </span>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-red-200 rounded-2xl border-1 border-red-500 flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          Classroom not found
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
        <div className="mt-20 max-w-4xl mx-auto bg-orange-200 border border-orange-500 rounded-2xl p-6 text-center">
          <h1 className="text-xl font-medium text-yellow-800 mb-2">Access Restricted</h1>
          <p className="text-yellow-700">
            {userData?.role === 'teacher' 
              ? "You don't have permission to view this classroom as you're not the teacher in charge."
              : "You don't have access to this classroom. Please ensure you're enrolled."}
          </p>
        </div>
    );
  }

  if (pageLoading) {
    return (
      <div className='w-full pt-20 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Loading..</p>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5fa] shadow-lg rounded-2xl overflow-x-hidden h-fit mt-10">
      <header className="bg-cyan-600 text-white">
        <section className="max-w-7xl mx-auto px-9 pt-7">
          <div className="flex justify-between items-start mb-4">
            <hgroup>
              <h1 className="text-3xl font-medium mb-1">{classroom.name}</h1>
              <p className="flex items-center gap-2 text-white/90 text-sm">
                <span>{classroom.teacher_name}</span>
                <span>•</span>
                <span>{classroom.teacher_username}</span>
              </p>
            </hgroup>
            <time className="text-sm text-white/75">
              Created {new Date(classroom.created_at).toLocaleDateString()}
            </time>
          </div>
          
          <nav className="flex gap-8 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('tests')}
              className={`py-4 hover:cursor-pointer ${
                activeTab === 'tests'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Tests
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`py-4 hover:cursor-pointer ${
                activeTab === 'students'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Students
            </button>
            {userData?.role !== 'student' && (
              <button 
                onClick={() => setActiveTab('settings')}
                className={`py-4 hover:cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-white text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Settings
              </button>
            )}
          </nav>
        </section>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tests' ? (
          <ClassroomTests />
        ) : activeTab === 'students' ? (
          <ClassroomStudents />
        ) : (
          (userData?.role === 'teacher' || userData?.role === 'admin') && 
          <ClassroomSettings 
            currentName={classroom.name}
            onUpdate={handleClassUpdate}
          />
        )}
      </section>
    </div>
  );
}
