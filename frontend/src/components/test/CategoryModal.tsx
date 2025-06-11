import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import type { Category } from '../../types/category-type';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/php/test/create_category.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      setNewCategory('');
      await fetchCategories();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories" type='add'>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 hover:cursor-pointer transition-colors"
            >
              {isLoading ? 'Adding...' : 'Add category'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 mb-3">Existing Categories</h3>
          {categories.length > 0 ? (
            <ul className="
              divide-y divide-gray-200 max-h-[200px] overflow-y-auto
              scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]
            ">
              {categories.map((category) => (
                <li key={category.id} className="py-2 flex justify-between items-center">
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">ID: {category.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No categories available</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
