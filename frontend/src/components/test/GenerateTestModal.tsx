import { useState, useEffect } from 'react';
import type { Category } from '../../types/category-type';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

interface GenerateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateTestModal({ isOpen, onClose, onSuccess }: GenerateTestModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const ai = new GoogleGenAI({ apiKey: apiKey });

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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !topic.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const selectedCategoryName = categories.find(c => c.id.toString() === selectedCategory)?.name;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
            Create a multiple choice test with these requirements:
          - Topic: ${topic}
          - Category: ${selectedCategoryName}
          - Maximum 5 questions
          - Each question must have 2 or 4 options
          - Only one correct option per question
          - Provide your response in JSON format with the following structure, avoiding any additional text or explanations, like markdown to encapsulate the JSON:
          {
            "name": "Generated Test Name",
            "questions": [
                {
                    "question_text": "What is...",
                    "type": "multiple_choice",
                    "options": [
                        {
                            "option_text": "First option",
                            "is_correct": true,
                            "index_order": 0
                        },
                        {
                            "option_text": "Second option",
                            "is_correct": false,
                            "index_order": 1
                        }
                    ]
                },
                {
                    "question_text": "Another question..",
                    "type": "multiple_choice",
                    "options": [
                        {
                            "option_text": "Option A",
                            "is_correct": false,
                            "index_order": 0
                        },
                        {
                            "option_text": "Option B",
                            "is_correct": true,
                            "index_order": 1
                        }
                    ]
                }
            ]
          }
          `,
      });

      if (!response.text) throw new Error('No response from AI');
      
      const cleanResponse = response.text.replace(/^```(?:json)?\s*|\s*```$/g, '');
      const generatedTest = JSON.parse(cleanResponse);

      // Create the test
      const testResponse = await fetch('/php/test/create_test.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generatedTest.name,
          category: parseInt(selectedCategory)
        }),
      });

      if (!testResponse.ok) throw new Error('Failed to create test');
      const testData = await testResponse.json();
      const testId = testData.test_id;

      // Create questions and their options
      for (const question of generatedTest.questions) {
        const questionResponse = await fetch('/php/test/create_question.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test: testId,
            question_text: question.question_text,
            type: question.type
          }),
        });

        if (!questionResponse.ok) throw new Error('Failed to create question');
        const questionData = await questionResponse.json();
        const questionId = questionData.id;

        // Create options for this question
        for (const option of question.options) {
          const optionResponse = await fetch('/php/test/create_option.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: questionId,
              option_text: option.option_text,
              is_correct: option.is_correct,
              index_order: option.index_order
            }),
          });

          if (!optionResponse.ok) throw new Error('Failed to create option');
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Full error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory('');
    setTopic('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Test with AI</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Topic
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the topic for the test (e.g., 'Basic SQL commands and their usage')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">↻</span>
                  Generating...
                </>
              ) : (
                'Generate Test'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
