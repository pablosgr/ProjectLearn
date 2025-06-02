import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import TestQuestions from '../components/test/TestQuestion';
import TestSettings from '../components/test/TestSettings';
import type { TestType } from '../types/test-type';
import type { ApiQuestionType } from '../types/question-type';
import type { OptionType } from '../types/option-type';

type Tab = 'questions' | 'settings';

export default function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useUserData();
  const [test, setTest] = useState<TestType | null>(null);
  const [questions, setQuestions] = useState<ApiQuestionType[]>([]);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('questions');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTestData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch test details
        const testResponse = await fetch('/php/test/get_test.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!testResponse.ok) throw new Error('Failed to fetch test details');
        const testData = await testResponse.json();
        setTest(testData[0]);

        // Fetch questions for this test
        const questionsResponse = await fetch('/php/test/get_questions.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: testData[0].id }),
        });

        if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        const allOptions: OptionType[] = [];
        
        for (const question of questionsData) {
          const optionsResponse = await fetch('/php/test/get_options.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: question.id }),
          });

          if (!optionsResponse.ok) throw new Error('Failed to fetch options');
          const questionOptions = await optionsResponse.json();
          // Check if questionOptions is an array before spreading
          if (Array.isArray(questionOptions)) {
            allOptions.push(...questionOptions);
          } else if (questionOptions) {
            // If it's a single option, push it directly
            allOptions.push(questionOptions);
          }
        }

        setOptions(allOptions);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAllTestData();
    }
  }, [id]);

  // Transform the data for rendering
  const transformedQuestions = questions.map(question => {
    const questionOptions = options.filter(opt => opt.question === question.id);
    return {
      id: question.id,
      question: question.question_text,
      answers: questionOptions
        .sort((a, b) => a.index_order - b.index_order)
        .map(opt => opt.option_text),
      correctAnswer: questionOptions.findIndex(opt => opt.is_correct)
    };
  });

  const handleTestUpdate = (newName: string, newCategory: string) => {
    setTest(prev => prev ? { ...prev, name: newName, category: newCategory } : null);
  };

  if (isLoading) {
    return (
      <main className="h-40 rounded-lg bg-gray-100 grid place-items-center">
        <p className="text-gray-600">Loading test details...</p>
      </main>
    );
  }

  if (error || !test) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Test not found'}
        </p>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 rounded-lg overflow-hidden h-full">
      <header className="bg-cyan-600 text-white">
        <section className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex justify-between items-start mb-4">
            <hgroup>
              <h1 className="text-3xl font-medium mb-1">{test.name}</h1>
              <p className="flex items-center gap-2 text-white/90 text-sm">
                <span>{test.author_name}</span>
                <span>•</span>
                <span>{test.category}</span>
              </p>
            </hgroup>
            <time className="text-sm text-white/75">
              Created {new Date(test.created_at).toLocaleDateString()}
            </time>
          </div>
          
          <nav className="flex gap-8 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('questions')}
              className={`py-4 ${
                activeTab === 'questions'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Questions
            </button>
            {userData?.role === 'teacher' && (
              <button 
                onClick={() => setActiveTab('settings')}
                className={`py-4 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-white text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Settings ⚙️
              </button>
            )}
          </nav>
        </section>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'questions' ? (
          <TestQuestions 
            questions={transformedQuestions}
            onQuestionsUpdate={(newQuestions) => {
              // Handle updates if needed
              console.log('Questions updated:', newQuestions);
            }}
            isTeacher={userData?.role === 'teacher'}
          />
        ) : (
          userData?.role === 'teacher' && (
            <TestSettings 
              test={test}
              onUpdate={handleTestUpdate}
            />
          )
        )}
      </section>
    </main>
  );
}
