import type { FC } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Copy } from 'lucide-react';
import { CopyCheck } from 'lucide-react';


interface ClassroomSettingsProps {
  currentName: string;
  onUpdate: (newName: string) => void;
}

const ClassroomSettings: FC<ClassroomSettingsProps> = ({ currentName, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const enrollmentLink = `${window.location.origin}/enroll/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(enrollmentLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (name.trim() === '') {
      setError('Class name cannot be empty');
      setTimeout(() => setError(null), 2000);
      return;
    }
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
      setTimeout(() => setSuccess(false), 2000);
      onUpdate(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update classroom');
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl text-neutral-900 font-medium mb-6">Class Settings</h2>
      <form onSubmit={handleSubmit} className="text-neutral-600 max-w-md space-y-4 mb-8">
        <div>
          <label htmlFor="className" className="block text-md font-medium text-gray-700 mb-1">
            New class name
          </label>
          <input
            type="text"
            id="className"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border-1 border-neutral-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Class updated successfully!</p>}

        <button
          type="submit"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 hover:cursor-pointer transition-colors"
        >
          Save Changes
        </button>
      </form>

      <div className="border-t border-neutral-400 pt-6">
        <h3 className="text-lg text-neutral-900 font-medium mb-4">Student Enrollment</h3>
        <div className="max-w-md space-y-2">
          <p className="text-sm text-gray-600">
            Share this link with students to let them join the class:
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={enrollmentLink}
              className="text-neutral-500 flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-2 py-2 text-cyan-600 rounded-lg hover:bg-cyan-200/60 hover:cursor-pointer transition-colors"
              title="Copy link"
            >
              {copySuccess ? <CopyCheck /> : <Copy />}
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-600 text-sm">Link copied to clipboard!</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ClassroomSettings;
