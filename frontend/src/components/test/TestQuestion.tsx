import { useState } from 'react';
import QuestionField from './QuestionField';
import type { TestQuestion } from '../../types/test-type';

interface TestQuestionsProps {
  questions?: TestQuestion[];
  onQuestionsUpdate: (questions: TestQuestion[]) => void;
  isTeacher: boolean;
}

const adjustOptions = (question: TestQuestion, targetCount: 2 | 4): TestQuestion => {
  const currentOptions = [...question.options];
  const currentCount = currentOptions.length;

  if (targetCount > currentCount) {
    const newOptions = Array(targetCount - currentCount).fill(null).map((_, i) => ({
      id: 0,
      option_text: '',
      is_correct: false,
      index_order: currentCount + i
    }));
    return { ...question, options: [...currentOptions, ...newOptions] };
  }

  if (targetCount < currentCount) {
    const hasCorrectInRemoved = currentOptions.slice(targetCount).some(opt => opt.is_correct);
    const newOptions = currentOptions.slice(0, targetCount);
    
    if (hasCorrectInRemoved && !newOptions.some(opt => opt.is_correct)) {
      newOptions[0].is_correct = true;
    }
    
    return { ...question, options: newOptions };
  }

  return question;
};

export default function TestQuestions({ questions = [], onQuestionsUpdate, isTeacher }: TestQuestionsProps) {
    const [errors] = useState<Record<number, {
        question_text?: string;
        options?: string[];
    }>>({});

    // Add a guard clause at the start of the component
    if (!Array.isArray(questions)) {
        return null;
    }

    const addNewQuestion = () => {
        if (questions.length < 10) {
            onQuestionsUpdate([...questions, {
                id: 0,
                question_text: '',
                type: null,
                options: [
                    { id: 0, option_text: '', is_correct: true, index_order: 0 },
                    { id: 0, option_text: '', is_correct: false, index_order: 1 }
                ]
            }]);
        }
    };

    const removeQuestion = (index: number) => {
        onQuestionsUpdate(questions.filter((_, i) => i !== index));
    };

    const handleQuestionDataUpdate = (index: number, newData: TestQuestion) => {
      const newQuestions = [...questions];
      newQuestions[index] = newData;
      onQuestionsUpdate(newQuestions);
    };

    if (!isTeacher) {
        return (
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-medium mb-4">Question {index + 1}</h3>
                        <p className="mb-4">{question.question_text}</p>
                        <div className="space-y-2">
                            {question.options.map((answer, answerIndex) => (
                                <div 
                                    key={answerIndex}
                                    className={`p-3 rounded-lg ${
                                        answer.is_correct
                                          ? 'bg-green-100 border border-green-300' 
                                          : 'bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    {answer.option_text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl text-neutral-900 font-medium">Questions ({questions.length}/10)</h2>
                {questions.length < 10 && (
                    <button
                        onClick={addNewQuestion}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                        + Add Question
                    </button>
                )}
            </div>

            {questions.map((questionData, index) => (
                <div key={index} className="relative border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-4">
                        {questions.length > 1 && (
                            <button
                                onClick={() => removeQuestion(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                ❌ Remove
                            </button>
                        )}
                    </div>
                    <QuestionField
                        questionNumber={index + 1}
                        questionData={questionData}
                        setQuestionData={(newData: TestQuestion) => handleQuestionDataUpdate(index, newData)}
                        errors={errors[index]}
                    />
                    <button
                        onClick={() => {
                            const newQuestions = [...questions];
                            const targetCount = questionData.options.length === 2 ? 4 : 2;
                            newQuestions[index] = adjustOptions(questionData, targetCount);
                            onQuestionsUpdate(newQuestions);
                        }}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                        {questionData.options.length === 2 ? '+ Add 2 More Options' : '- Remove 2 Options'}
                    </button>
                </div>
            ))}
        </div>
    );
}
