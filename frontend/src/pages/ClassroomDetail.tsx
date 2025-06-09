import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import ClassroomTests from '../components/classroom/ClassroomTests';
import ClassroomStudents from '../components/classroom/ClassroomStudents';
import ClassroomSettings from '../components/classroom/ClassroomSettings';
import type { ClassroomType } from '../types/classroom-type';

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
        // If user is teacher, check if they own the classroom
        if (userData.role === 'teacher') {
          setHasAccess(classroom?.teacher_id === userData.id);
          return;
        }

        // If user is admin, they always have access
        if (userData.role === 'admin') {
          setHasAccess(true);
          return;
        }

        // If user is student, check if they're enrolled
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
      <main className="h-40 rounded-lg bg-gray-100 grid place-items-center">
        <p className="text-gray-600">Loading classroom details...</p>
      </main>
    );
  }

  if (error || !classroom) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Classroom not found'}
        </p>
      </main>
    );
  }

  // Add access check before main content
  if (!hasAccess) {
    return (
      <div className="h-full bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-medium text-yellow-800 mb-2">Access Restricted</h1>
          <p className="text-yellow-700">
            {userData?.role === 'teacher' 
              ? "You don't have permission to view this classroom as you're not the teacher in charge."
              : "You don't have access to this classroom. Please ensure you're enrolled."}
          </p>
        </div>
      </div>
    );
  }

  // Add page loading check before other loading states
  if (pageLoading) {
    return (
      <div className="h-full bg-gray-100 grid place-items-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">↻</div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 rounded-lg overflow-hidden h-full">
      <header className="bg-cyan-600 text-white">
        <section className="max-w-7xl mx-auto px-6 pt-4">
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
              className={`py-4 ${
                activeTab === 'tests'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Tests
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`py-4 ${
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
                className={`py-4 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-white text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Settings ⚙️
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
    </main>
  );
}
