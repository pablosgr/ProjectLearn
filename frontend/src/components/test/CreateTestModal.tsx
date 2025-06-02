import { useState, useEffect } from 'react';
import QuestionField from './QuestionField';
import type { Category } from '../../types/category-type';
import type { Question } from '../../types/question-type';

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTestModal({ isOpen, onClose, onSuccess }: CreateTestModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [testName, setTestName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    question: '',
    answers: ['', ''],
    correctAnswer: 0
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    testName: '',
    category: '',
    questions: {} as Record<number, {
      question: string,
      answers: string[]
    }>
  });

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

  const addNewQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, {
        question: '',
        answers: ['', ''],
        correctAnswer: 0
      }]);
    }
  };

  const validateForm = () => {
    const newErrors = {
      testName: '',
      category: '',
      questions: {} as Record<number, {
        question: string,
        answers: string[]
      }>
    };
    let isValid = true;

    // Validate test name
    if (!testName.trim()) {
      newErrors.testName = 'Test name is required';
      isValid = false;
    }

    // Validate category
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    // Validate questions
    questions.forEach((q, index) => {
      const questionErrors = {
        question: '',
        answers: [] as string[]
      };

      if (!q.question.trim()) {
        questionErrors.question = 'Question text is required';
        isValid = false;
      }

      q.answers.forEach((answer, answerIndex) => {
        if (!answer.trim()) {
          questionErrors.answers[answerIndex] = 'Answer text is required';
          isValid = false;
        }
      });

      if (Object.keys(questionErrors).length > 0) {
        newErrors.questions[index] = questionErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create test
      const testResponse = await fetch('/php/test/create_test.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName.trim(),
          category: parseInt(selectedCategory)
        }),
      });

      if (!testResponse.ok) throw new Error('Failed to create test');
      const testData = await testResponse.json();
      const testId = testData.test_id;

      // Create questions and their options
      for (const question of questions) {
        // Create question
        const questionResponse = await fetch('/php/test/create_question.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test: testId,
            question_text: question.question
          }),
        });

        if (!questionResponse.ok) throw new Error('Failed to create question');
        const questionData = await questionResponse.json();
        const questionId = questionData.id;

        // Create options for this question
        for (let i = 0; i < question.answers.length; i++) {
          const optionResponse = await fetch('/php/test/create_option.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: questionId,
              option_text: question.answers[i],
              is_correct: i === question.correctAnswer,
              index_order: i
            }),
          });

          if (!optionResponse.ok) throw new Error('Failed to create option');
        }
      }

      onSuccess();
      // Reset form
      setTestName('');
      setSelectedCategory('');
      setQuestions([{
        question: '',
        answers: ['', ''],
        correctAnswer: 0
      }]);
      setErrors({
        testName: '',
        category: '',
        questions: {}
      });

    } catch (error) {
      console.error('Error creating test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all form fields
    setTestName('');
    setSelectedCategory('');
    setQuestions([{
      question: '',
      answers: ['', ''],
      correctAnswer: 0
    }]);
    setErrors({
      testName: '',
      category: '',
      questions: {}
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Test</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Name
            </label>
            <input
              type="text"
              value={testName}
              onChange={(e) => {
                setTestName(e.target.value);
                if (errors.testName) {
                  setErrors(prev => ({ ...prev, testName: '' }));
                }
              }}
              className={`w-full px-3 py-2 border ${errors.testName ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
            />
            {errors.testName && (
              <p className="mt-1 text-sm text-red-500">{errors.testName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: '' }));
                }
              }}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Questions ({questions.length}/10)</h3>
              {questions.length < 10 && (
                <button
                  type="button"
                  onClick={addNewQuestion}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  + Add Another Question
                </button>
              )}
            </div>
            
            {questions.map((questionData, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <QuestionField 
                  questionNumber={index + 1}
                  questionData={questionData}
                  setQuestionData={(newData: Question | ((prev: Question) => Question)) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = typeof newData === 'function' ? newData(questionData) : newData;
                    setQuestions(newQuestions);
                  }}
                  disabled={isLoading}
                />
                {errors.questions[index]?.question && (
                  <p className="mt-1 text-sm text-red-500">{errors.questions[index]?.question}</p>
                )}
                {errors.questions[index]?.answers?.map((error, answerIndex) => (
                  error ? (
                    <p key={answerIndex} className="mt-1 text-sm text-red-500">{error}</p>
                  ) : null
                ))}
              </div>
            ))}
          </div>

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
              disabled={isLoading || questions.length === 0}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
