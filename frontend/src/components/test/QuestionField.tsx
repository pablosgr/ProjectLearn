import type { TestQuestion } from '../../types/test-type';

interface QuestionFieldProps {
  questionNumber: number;
  questionData: TestQuestion;
  setQuestionData: (question: TestQuestion) => void;
  errors?: {
    question_text?: string;
    options?: string[];
  };
  disabled?: boolean;
}

export default function QuestionField({ 
  questionNumber, 
  questionData, 
  setQuestionData, 
  errors, 
  disabled = false 
}: QuestionFieldProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question {questionNumber}
        </label>
        <input
          type="text"
          value={questionData.question_text}
          onChange={(e) => setQuestionData({ ...questionData, question_text: e.target.value })}
          className={`w-full px-3 py-2 border ${errors?.question_text ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-teal-600 focus:border-teal-600`}
          disabled={disabled}
        />
        {errors?.question_text && (
          <p className="mt-1 text-sm text-red-500">{errors.question_text}</p>
        )}
      </div>

      <div className="space-y-3">
        {questionData.options.map((option, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name={`correctAnswer${questionNumber}`}
                checked={option.is_correct}
                onChange={() => {
                  const newOptions = questionData.options.map((opt, i) => ({
                    ...opt,
                    is_correct: i === index
                  }));
                  setQuestionData({ ...questionData, options: newOptions });
                }}
                className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                disabled={disabled}
              />
              <input
                type="text"
                value={option.option_text}
                onChange={(e) => {
                  const newOptions = [...questionData.options];
                  newOptions[index] = { ...newOptions[index], option_text: e.target.value };
                  setQuestionData({ ...questionData, options: newOptions });
                }}
                className={`flex-1 px-3 py-2 border ${errors?.options?.[index] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                placeholder={`Option ${index + 1}`}
                disabled={disabled}
              />
            </div>
            {errors?.options?.[index] && (
              <p className="text-sm text-red-500">{errors.options[index]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
