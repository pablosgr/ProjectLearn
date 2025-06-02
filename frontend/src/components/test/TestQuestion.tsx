import { useState } from 'react';
import QuestionField from './QuestionField';
import type { Question, QuestionError } from '../../types/question-type';

interface TestQuestionsProps {
  questions: Question[];
  onQuestionsUpdate: (questions: Question[]) => void;
  isTeacher: boolean;
}

export default function TestQuestions({ questions, onQuestionsUpdate, isTeacher }: TestQuestionsProps) {
  const [errors] = useState<Record<number, QuestionError>>({});

  const addNewQuestion = () => {
    if (questions.length < 10) {
      onQuestionsUpdate([...questions, {
        question: '',
        answers: ['', ''],
        correctAnswer: 0
      }]);
    }
  };

  const removeQuestion = (index: number) => {
    onQuestionsUpdate(questions.filter((_, i) => i !== index));
  };

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Question {index + 1}</h3>
            <p className="mb-4">{question.question}</p>
            <div className="space-y-2">
              {question.answers.map((answer, answerIndex) => (
                <div 
                  key={answerIndex}
                  className={`p-3 rounded-lg ${
                    question.correctAnswer === answerIndex 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {answer}
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
          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              ❌ Remove
            </button>
          )}
          <QuestionField
            questionNumber={index + 1}
            questionData={questionData}
            setQuestionData={(newData: Question) => {
              const newQuestions = [...questions];
              newQuestions[index] = newData;
              onQuestionsUpdate(newQuestions);
            }}
            errors={errors[index]}
          />
        </div>
      ))}
    </div>
  );
}
