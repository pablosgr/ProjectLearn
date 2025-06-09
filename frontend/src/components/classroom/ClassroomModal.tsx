import type { FC } from 'react';
import { useState } from 'react';
import Modal from '../ui/Modal';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateClassModal: FC<CreateClassModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [className, setClassName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/php/classroom/post_classroom.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClassName('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create classroom');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Create New Class"
      actionColor='green'
    >
      <div className="space-y-4">
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </Modal>
  );
};

export default CreateClassModal;
