import { useEffect, useState } from 'react';
import { useUserData } from '../../context/UserContext';
import { useNavigate } from 'react-router';
import Modal from '../ui/Modal';
import type { AssignedTest } from '../../types/test-type';
import { Trash } from 'lucide-react';

interface TestAssignmentCardProps {
  classroomId: string;
  test: AssignedTest;
  onDelete: (testId: number) => Promise<void>;
}

interface TestResultRequest {
  class_id: string;
  test_id: number;
  user_id?: string;
}

export default function TestAssignmentCard({ classroomId, test, onDelete }: TestAssignmentCardProps) {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(userData?.role !== 'admin');
  const [hasResult, setHasResult] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await onDelete(test.test_id);
      setShowDeleteModal(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove assignment');
      setShowDeleteModal(false);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const checkForResults = async () => {
    // Skip fetching results if user is admin
    if (userData?.role === 'admin') return;
    
    setIsLoading(true);

    try {
      const requestBody: TestResultRequest = {
        class_id: classroomId,
        test_id: test.test_id,
        ...(userData?.role === 'student' && { user_id: userData.id as string })
      };

      const response = await fetch(`/php/test/get_test_result.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.error) {
        setHasResult(false);
        throw new Error(data.error);
      }

      if (data.length > 0) {
        setHasResult(true);
      }
    } catch (error) {
      console.error('Error checking results:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // Only check results if not admin
    if (userData?.role !== 'admin') {
      checkForResults();
    }
  }, [userData?.role]);

  const isPastDue = () => {
    if (!test.due_date) return false;
    return new Date(test.due_date) < new Date();
  };

  return (
    <>
      <article className="flex flex-col bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="text-lg text-black font-semibold mb-2">
            {test.test_name} - {test.test_category}
          </h3>
          {userData?.role === 'teacher' && (
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setError(null);
              }}
              className="text-red-400 hover:bg-red-200 rounded-lg p-2 hover:cursor-pointer transition-colors"
              title="Remove assignment"
            >
              <Trash size={22} />
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1 flex flex-row justify-between items-end">
          <div className='pt-5'>
            <p>Assigned: {new Date(test.assigned_at).toLocaleDateString()}</p>
            {test.due_date && (
              <div className="flex items-center gap-2">
                <p>Due: {new Date(test.due_date).toLocaleDateString()}</p>
                {isPastDue() && !hasResult && (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Past Due
                  </span>
                )}
              </div>
            )}
            {test.time_limit && (
              <p>Time limit: {test.time_limit} minutes</p>
            )}
          </div>
          {!isLoading && userData?.role !== 'admin' && (
            <>
              {(userData?.role === 'teacher' || hasResult || !isPastDue()) && (
                <button
                  onClick={() => navigate(
                    hasResult 
                      ? `/test-result/${test.test_id}/classroom/${classroomId}` 
                      : `/test-session/${test.test_id}/classroom/${classroomId}`
                  )}
                  className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 hover:cursor-pointer transition-colors"
                >
                  {userData?.role === 'teacher' 
                    ? 'View Results'
                    : hasResult 
                      ? 'View Result' 
                      : 'Go to Test'
                  }
                </button>
              )}
            </>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
      </article>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setError(null);
        }}
        onConfirm={handleDelete}
        title="Remove Test Assignment"
      >
        <p className="text-neutral-600">
          Are you sure you want to remove <strong>{test.test_name}</strong> from this classroom?
          <br />
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
