import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { TestResultResponse } from '../types/test-type';
import { LoaderCircle } from 'lucide-react';

interface TestResultSummary {
  averageScore: number;
  totalStudents: number;
  completedTests: number;
  highestScore: number;
  lowestScore: number;
  scoreDistribution: {
    [key: string]: number;
  };
}

export default function TestResult() {
  const { testId, classroomId } = useParams<{ testId: string; classroomId: string }>();
  const { userData } = useUserData();
  const [results, setResults] = useState<TestResultResponse[]>([]);
  const [summary, setSummary] = useState<TestResultSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const requestBody = {
            test_id: testId,
            class_id: classroomId,
            ...(userData?.role === 'student' && { user_id: userData.id })
        }

        const response = await fetch('/php/test/get_test_result.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error('Failed to fetch results');

        const data = await response.json();
        
        // Ensure data is an array
        const resultsArray = Array.isArray(data) ? data : [data];
        setResults(resultsArray);

        if (userData?.role === 'teacher') {
          let totalScore = 0;
          const completedTests = resultsArray.filter(r => r.status === 'completed');
          const scoreDistribution: { [key: string]: number } = {};

          resultsArray.forEach(result => {
            totalScore += result.score;
            const range = Math.floor(result.score / 10) * 10;
            const key = `${range}-${range + 10}`;
            scoreDistribution[key] = (scoreDistribution[key] || 0) + 1;
          });

          const summary: TestResultSummary = {
            averageScore: totalScore / resultsArray.length,
            totalStudents: resultsArray.length,
            completedTests: completedTests.length,
            highestScore: Math.max(...resultsArray.map(r => r.score)),
            lowestScore: Math.min(...resultsArray.map(r => r.score)),
            scoreDistribution
          };
          
          setSummary(summary);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [testId, classroomId, userData]);

  if (isLoading) {
    return (
      <div className='w-full pt-20 flex items-center justify-center'>
        <span className='flex flex-col items-center gap-4'>
          <LoaderCircle className='animate-spin' size={50} />
          <p className='text-lg font-medium'>Loading test result..</p>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
      <section className="max-w-7xl mt-20 mx-auto px-6">
        {userData?.role === 'teacher' ? (
          <>
            <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Results Summary</h1>
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-cyan-900 mb-2">Average Score</h3>
                    <p className="text-3xl font-bold text-cyan-700">{summary.averageScore.toFixed(1)}%</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-cyan-900 mb-2">Completion Rate</h3>
                    <p className="text-3xl font-bold text-cyan-700">
                      {((summary.completedTests / summary.totalStudents) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-cyan-900 mb-2">Score Range</h3>
                    <p className="text-3xl font-bold text-cyan-700">
                      {summary.lowestScore}% - {summary.highestScore}%
                    </p>
                  </div>
                </div>
              )}
            </header>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Individual Results</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr 
                        key={`${result.id}-${result.student}`} 
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.student}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.score}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.ended_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-10">
            {results.length > 0 && (
              <div className="w-full mx-auto">
                <h1 className="text-2xl font-medium text-gray-900 mb-6">Your Test Result</h1>
                <div className="space-y-6">
                  <div className="text-center p-8 bg-teal-100/60 rounded-xl">
                    <h2 className="text-md font-medium text-teal-900 mb-2">Final Score</h2>
                    <p className="text-5xl font-bold text-teal-600">{results[0].score}%</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-100/60 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-1">Questions</h3>
                      <p className="text-2xl font-bold text-gray-700">
                        {results[0].correct_answers} / {results[0].total_questions}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">correct answers</p>
                    </div>
                    <div className="p-4 bg-teal-100/60 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-1">Time Taken</h3>
                      <p className="text-2xl font-bold text-gray-700">
                        {Math.round((new Date(results[0].ended_at).getTime() - 
                          new Date(results[0].started_at).getTime()) / 60000)} min
                      </p>
                      <p className="text-xs text-gray-500 mt-1">to complete</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
  );
}
