import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';
import { LoaderCircle } from 'lucide-react';
import { CircleAlert } from 'lucide-react';

export default function EnrollClassroom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enrollStudent = async () => {
      try {
        const response = await fetch('/php/classroom/enroll_student.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classroom_id: id }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        navigate(`/classroom/${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to enroll');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userData.role === 'student') {
      enrollStudent();
    } else if (userData && (userData.role === 'teacher' || userData.role === 'admin')) {
      setError("Only students can enroll in classrooms");
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }, [id, userData, navigate]);

  if (isLoading) {
    return (
      <div className="
        h-full w-full flex flex-row items-center justify-center gap-8 place-items-center 
        bg-green-200 border-green-700 border-1 rounded-2xl p-8
      ">
        <LoaderCircle className="animate-spin" size={42} color='#3fa151' />
        <p className="text-green-700 text-xl">Enrolling in classroom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="
        h-full w-full flex flex-row items-center justify-center gap-8 place-items-center 
        bg-red-200 border-red-700 border-1 rounded-2xl p-8
      ">
        <CircleAlert size={42} color='red' />
        <p className="text-red-700 text-xl">{error}</p>
      </div>
    );
  }

  return null;
}
