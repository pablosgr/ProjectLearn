import { useState, useEffect } from 'react';
import type { TestType } from '../../types/test-type';

interface AssignTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: any) => Promise<void>;
  classroomId: string;
  teacherId: string;
}

export default function AssignTestModal({ 
  isOpen, 
  onClose, 
  onAssign, 
  classroomId,
  teacherId 
}: AssignTestModalProps) {
  const [tests, setTests] = useState<TestType[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    test_id: '',
    due_date: '',
    time_limit: '',
    visibility: true,
    is_mandatory: false
  });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('/php/test/teacher_get_tests.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch tests');
        
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    if (isOpen) {
      fetchTests();
    }
  }, [isOpen, teacherId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const now = new Date();

    if (selectedDate <= now) {
      setDateError('Due date must be in the future');
      return;
    }

    setDateError(null);
    setFormData(prev => ({ ...prev, due_date: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.due_date) {
      const selectedDate = new Date(formData.due_date);
      const now = new Date();

      if (selectedDate <= now) {
        setDateError('Due date must be in the future');
        return;
      }
    }
    
    const assignmentData = {
      classroom_id: parseInt(classroomId),
      test_id: parseInt(formData.test_id),
      due_date: formData.due_date || null,
      time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
      visibility: formData.visibility,
      is_mandatory: formData.is_mandatory
    };

    await onAssign(assignmentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Assign New Test</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="test" className="block text-sm font-medium text-gray-700">
              Select Test
            </label>
            <select
              id="test"
              className="mt-1 block w-full text-black rounded-md border border-gray-300 p-2"
              value={formData.test_id}
              onChange={(e) => setFormData(prev => ({ ...prev, test_id: e.target.value }))}
              required
            >
              <option value="">Choose a test...</option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date (optional)
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              className={`text-black mt-1 block w-full rounded-md border ${
                dateError ? 'border-red-500' : 'border-gray-300'
              } p-2`}
              value={formData.due_date}
              onChange={handleDateChange}
            />
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
              Time Limit (minutes, optional)
            </label>
            <input
              type="number"
              id="timeLimit"
              className="text-black mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={formData.time_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, time_limit: e.target.value }))}
              min="1"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Visible to students</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_mandatory}
                onChange={(e) => setFormData(prev => ({ ...prev, is_mandatory: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Mandatory</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Assign Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
