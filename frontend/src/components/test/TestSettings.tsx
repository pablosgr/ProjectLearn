import { useState, useEffect } from 'react';
import type { TestType } from '../../types/test-type';
import type { Category } from '../../types/category-type';

interface TestSettingsProps {
  test: TestType;
  onUpdate: (name: string, category: string) => void;
}

export default function TestSettings({ test, onUpdate }: TestSettingsProps) {
  const [name, setName] = useState(test.name);
  const [selectedCategory, setSelectedCategory] = useState<string>(test.category);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/php/test/get_all_categories.php');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/php/test/update_test.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: test.id,
          name: name.trim(),
          category: selectedCategory
        }),
      });

      if (!response.ok) throw new Error('Failed to update test');
      
      onUpdate(name, selectedCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl text-neutral-900 font-medium mb-6">Test Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
