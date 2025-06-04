import { useState } from 'react';
import { useUserData } from '../../context/UserContext';
import Modal from '../ui/Modal';
import type { AssignedTest } from '../../types/test-type';

interface TestAssignmentCardProps {
  test: AssignedTest;
  onDelete: (testId: number) => Promise<void>;
}

export default function TestAssignmentCard({ test, onDelete }: TestAssignmentCardProps){
  const { userData } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="text-lg text-black font-semibold mb-2">{test.test_name} - {test.test_category}</h3>
          {userData?.role === 'teacher' && (
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setError(null);
              }}
              className="text-red-600 hover:text-red-800 p-2 hover:cursor-pointer"
              title="Remove assignment"
            >
              ❌
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          {test.unit_name && (
            <p>Unit: {test.unit_name}</p>
          )}
          <p>Assigned: {new Date(test.assigned_at).toLocaleDateString()}</p>
          {test.due_date && (
            <p>Due: {new Date(test.due_date).toLocaleDateString()}</p>
          )}
          {test.time_limit && (
            <p>Time limit: {test.time_limit} minutes</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              test.visibility 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {test.visibility ? 'Visible' : 'Hidden'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              test.is_mandatory 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {test.is_mandatory ? 'Mandatory' : 'Optional'}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setError(null);
        }}
        onConfirm={handleDelete}
        title="Remove Test Assignment"
      >
        <p className="text-neutral-200">
          Are you sure you want to remove <strong>{test.test_name}</strong> from this classroom?
          <br />
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
