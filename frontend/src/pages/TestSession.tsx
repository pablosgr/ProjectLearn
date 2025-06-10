import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { TestType, TestResult } from '../types/test-type';
import { LoaderCircle } from 'lucide-react';

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
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>(() => {
    // Initialize from localStorage if exists
    const saved = localStorage.getItem(`test_answers_${testId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [startTime] = useState<string>(new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Add enrollment check effect
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!userData || !classroomId) return;

      try {
        // Teachers and admins always have access
        if (userData.role === 'teacher' || userData.role === 'admin') {
          setHasAccess(true);
          return;
        }

        // Check student enrollment
        const response = await fetch('/php/classroom/classroom_get_students.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: classroomId }),
        });

        if (!response.ok) throw new Error('Failed to verify enrollment');

        const students = await response.json();
        const isEnrolled = students.some((student: any) => student.id === userData.id);
        setHasAccess(isEnrolled);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify access');
        setHasAccess(false);
      } finally {
        setPageLoading(false);
      }
    };

    checkEnrollment();
  }, [userData, classroomId]);

  // Modify existing useEffect to depend on hasAccess
  useEffect(() => {
    const fetchTest = async () => {
      if (!hasAccess) return;
      
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

    if (hasAccess) {
      fetchTest();
    }
  }, [testId, hasAccess]);

  // Clear localStorage after successful submission
  const clearSavedAnswers = () => {
    localStorage.removeItem(`test_answers_${testId}`);
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    const newAnswers = {
      ...studentAnswers,
      [questionId]: optionId
    };
    setStudentAnswers(newAnswers);
    // Save to localStorage
    localStorage.setItem(`test_answers_${testId}`, JSON.stringify(newAnswers));
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
      
      // Clear saved answers after successful submission
      clearSavedAnswers();
      navigate(`/classroom/${classroomId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Only clear if test was submitted successfully
      if (submitting) {
        clearSavedAnswers();
      }
    };
  }, [submitting, testId]);

  // Add page loading check
  if (pageLoading) {
    return (
      <div className='w-full pt-20 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Verifying test access..</p>
        </span>
      </div>
    );
  }

  // Add access check
  if (!hasAccess) {
    return (
        <div className="mt-20 max-w-4xl mx-auto bg-orange-200 border border-orange-500 rounded-2xl p-6 text-center">
          <h1 className="text-xl font-medium text-yellow-800 mb-2">Access Restricted</h1>
          <p className="text-yellow-700">
            You don't have access to this test. Please ensure you're enrolled in the classroom.
          </p>
        </div>
    );
  }

  if (isLoading) {
    return (
      <div className='w-full pt-20 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Loading test..</p>
        </span>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-red-200 rounded-2xl border-1 border-red-500 flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          Test not found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f5fa] shadow-lg rounded-2xl h-fit mt-10 py-8">
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
                className="px-6 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:cursor-pointer 
                  transition-colors"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" size={20} />
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
