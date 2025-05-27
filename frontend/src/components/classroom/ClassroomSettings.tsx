import type { FC } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';

interface ClassroomSettingsProps {
  currentName: string;
  onUpdate: (newName: string) => void;
}

const ClassroomSettings: FC<ClassroomSettingsProps> = ({ currentName, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/php/classroom/update_classroom.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccess(true);
      onUpdate(name); // Update parent state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update classroom');
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium mb-6">Class Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
            New Class Name
          </label>
          <input
            type="text"
            id="className"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-neutral-400"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        
        {success && (
          <p className="text-green-600 text-sm">Class updated successfully!</p>
        )}

        <button
          type="submit"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </article>
  );
};

export default ClassroomSettings;
