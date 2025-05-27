import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../../context/UserContext.tsx';
import Modal from '../ui/Modal';

interface ClassroomCardProps {
    id: string;
    name: string;
    teacherUsername: string;
    onDelete?: (id: string) => void;
}

const ClassroomCard: FC<ClassroomCardProps> = ({ id, name, teacherUsername, onDelete }) => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch('/php/classroom/remove_classroom.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete classroom');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking delete button or modal
    if ((e.target as HTMLElement).closest('.delete-btn') || 
        (e.target as HTMLElement).closest('.modal-content')) {
      e.stopPropagation();
      return;
    }
    navigate(`/classroom/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer w-80 relative"
      onClick={handleCardClick}
    >
      <div className="bg-cyan-600 text-white p-6 h-32 flex items-end">
        <h2 className="text-xl font-medium line-clamp-2">{name}</h2>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm h-10">Teacher: {teacherUsername}</p>
      </div>

      {userData?.role === 'teacher' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          className="delete-btn absolute top-2 right-2 p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-full"
          title="Delete classroom"
        >
          🗑️
        </button>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={(e) => {
          e?.stopPropagation();
          setShowDeleteModal(false);
        }}
        onConfirm={(e) => {
          e?.stopPropagation();
          handleDelete();
          setShowDeleteModal(false);
        }}
        title="Delete Classroom"
      >
        <p>Are you sure you want to delete "{name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ClassroomCard;
