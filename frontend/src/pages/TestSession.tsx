import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { TestType, TestResult } from '../types/test-type';

interface StudentAnswers {
  [questionId: number]: number;
}

export default function TestSession() {
  const { id: testId, classroomId } = useParams<{ id: string; classroomId: string }>();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [test, setTest] = useState<TestType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({});
  const [startTime] = useState<string>(new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/php/test/get_test.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: testId })
        });

        if (!response.ok) throw new Error('Failed to fetch test');
        
        const data = await response.json();
        setTest(data[0]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateTestResults = (answers: StudentAnswers, test: TestType): TestResult => {
    let correctAnswers = 0;
    
    test.questions.forEach(question => {
      const studentAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.is_correct);
      
      if (studentAnswer && correctOption && studentAnswer === correctOption.id) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / test.questions.length) * 100;

    return {
      user: userData?.id || '',
      class: parseInt(classroomId || '0'),
      test: test.id,
      score: Math.round(score),
      total_questions: test.questions.length,
      correct_answers: correctAnswers,
      status: 'completed',
      started_at: startTime,
      ended_at: new Date().toISOString()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Check if all questions are answered
    const unansweredQuestions = test?.questions.filter(
      q => !studentAnswers[q.id]
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      setSubmitError(`Please answer all questions. Missing: ${unansweredQuestions.length}`);
      return;
    }

    if (!test) return;

    try {
      setSubmitting(true);
      const testResults = calculateTestResults(studentAnswers, test);

      const response = await fetch('/php/test/post_test_result.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResults),
      });

      if (!response.ok) throw new Error('Failed to submit test');
      
      navigate(`/classroom/${classroomId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-red-600">{error || 'Test not found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <header className="bg-cyan-600 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">
            {test?.name}
          </h1>
        </header>

        {userData?.role === 'teacher' ? (
          <section className="space-y-8">
            {test?.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question_text}
                </h3>
                <div className="space-y-2">
                  {question.options.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg ${
                        option.is_correct
                          ? 'bg-green-100 border-green-200 text-green-800'
                          : 'bg-gray-50 text-gray-900'
                      } border`}
                    >
                      {option.option_text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {test?.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question_text}
                </h3>
                <div className="space-y-2">
                  {question.options.map(option => (
                    <label
                      key={option.id}
                      className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-gray-900"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={studentAnswers[question.id] === option.id}
                        onChange={() => handleAnswerChange(question.id, option.id)}
                        className="mr-3"
                      />
                      {option.option_text}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            {submitError && (
              <p className="text-red-600 text-sm">{submitError}</p>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin">↻</span>
                    Submitting...
                  </>
                ) : (
                  'Submit Test'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}