import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../../context/UserContext';
import AssignTestModal from '../test/AssignTestModal';
import TestAssignmentCard from '../test/TestAssignmentCard';
import type { AssignedTest } from '../../types/test-type';
import { LoaderCircle, Plus } from 'lucide-react';

export default function ClassroomTests() {
  const { id: classroomId } = useParams<{ id: string }>();
  const { userData } = useUserData();
  const [tests, setTests] = useState<AssignedTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const fetchAssignedTests = async () => {
    try {
      const response = await fetch('/php/test/get_assigned_tests.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: classroomId }),
      });

      if (!response.ok) throw new Error('Failed to fetch assigned tests');

      const data = await response.json();
      setTests(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTests();
  }, [classroomId]);

  const handleAssignTest = async (data: any) => {
    try {
      const response = await fetch('/php/test/create_test_assignment.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to assign test');

      await fetchAssignedTests();
    } catch (error) {
      console.error('Error assigning test:', error);
    }
  };

  const handleDeleteAssignment = async (testId: number) => {
    try {
      const response = await fetch('/php/test/delete_assigned_test.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classid: classroomId, testid: testId }),
      });

      if (!response.ok) throw new Error('Failed to remove test assignment');

      await fetchAssignedTests();
    } catch (error) {
      throw new Error('Failed to remove assignment');
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-full justify-center items-center">
        <div className="text-gray-600 p-10 flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin" color='#5d8297' size={45} />
          <span className='text-[#5d8297] text-md font-medium'>Loading tests..</span>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-red-600 py-8">{error}</div>;
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Assigned Tests</h2>
        {userData?.role === 'teacher' && (
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-cyan-600 text-white font-medium flex flex-row gap-3 py-2 px-3 rounded-lg hover:bg-cyan-700 transition-colors hover:cursor-pointer"
          >
            <Plus strokeWidth={3}/>
            Assign test
          </button>
        )}
      </div>

      <AssignTestModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignTest}
        classroomId={classroomId!}
        teacherId={userData?.id!}
      />

      {tests.length > 0 ? (
        <div className="flex flex-col gap-6">
          {tests.map((test) => (
            <TestAssignmentCard
              key={test.test_id}
              classroomId={classroomId!}
              test={test}
              onDelete={handleDeleteAssignment}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No tests assigned yet
        </p>
      )}
    </article>
  );
}
