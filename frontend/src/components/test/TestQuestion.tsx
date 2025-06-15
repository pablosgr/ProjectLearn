import { useState } from 'react';
import QuestionField from './QuestionField';
import type { TestQuestion } from '../../types/test-type';
import { Plus, Trash } from 'lucide-react';

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

    // Checks if questions is an array to avoid errors in map function
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
        <div className="space-y-6 flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-xl text-neutral-900 font-medium">Questions ({questions.length}/10)</h2>
            </div>

            {questions.map((questionData, index) => (
                <article key={index} className="relative border-b border-gray-300 pb-4 last:border-b-0">
                    <section className="mb-3 flex felx-row items-center justify-end gap-4">
                        <button
                            onClick={() => {
                                const newQuestions = [...questions];
                                const targetCount = questionData.options.length === 2 ? 4 : 2;
                                newQuestions[index] = adjustOptions(questionData, targetCount);
                                onQuestionsUpdate(newQuestions);
                            }}
                            className="
                                px-3 py-2 text-sm text-teal-600 border-teal-500 rounded-lg 
                                hover:bg-teal-200 hover:cursor-pointer transition-colors font-medium"
                        >
                            {questionData.options.length === 2 ? '+ Add 2 More Options' : '- Remove 2 Options'}
                        </button>
                        {questions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                                className="text-red-400 hover:bg-red-200 rounded-lg p-2 hover:cursor-pointer transition-colors"
                                title="Remove question"
                            >
                                <Trash size={22} />
                            </button>
                        )}
                    </section>
                    <QuestionField
                        questionNumber={index + 1}
                        questionData={questionData}
                        setQuestionData={(newData: TestQuestion) => handleQuestionDataUpdate(index, newData)}
                        errors={errors[index]}
                    />
                </article>
            ))}
            {questions.length < 10 && (
                <button
                    type="button"
                    onClick={addNewQuestion}
                    className="
                        w-fit self-end flex flex-row gap-2 items-center text-medium text-white p-2 rounded-lg 
                        bg-teal-600 hover:bg-teal-700 font-medium hover:cursor-pointer transition-colors"
                    >
                        <Plus className="inline mr-3" strokeWidth={3} />
                        <span>Add Question</span>
                </button>
            )}
        </div>
    );
}
