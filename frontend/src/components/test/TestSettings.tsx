import { useState, useEffect } from 'react';
import type { TestType } from '../../types/test-type';

interface Category {
  id: number;
  name: string;
}

interface TestSettingsProps {
  test: TestType;
  onUpdate: (name: string, category_id: number, category: string) => void;
}

export default function TestSettings({ test, onUpdate }: TestSettingsProps) {
  const [name, setName] = useState(test.name);
  const [selectedCategory, setSelectedCategory] = useState<Category>({ id: test.category_id, name: test.category });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/php/test/get_all_categories.php');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setName(test.name);
    setSelectedCategory({ id: test.category_id, name: test.category });
  }, [test.name, test.category_id, test.category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onUpdate(e.target.value, selectedCategory.id, selectedCategory.name);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = categories.find(cat => cat.id === Number(e.target.value));
    if (category) {
      setSelectedCategory(category);
      onUpdate(name, category.id, category.name);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl text-neutral-900 font-medium mb-6">Test Settings</h2>
      
      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory.id}
            onChange={handleCategoryChange}
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
      </div>
    </div>
  );
}
