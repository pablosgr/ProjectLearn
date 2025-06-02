interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface QuestionFieldProps {
  questionNumber: number;
  questionData: Question;
  setQuestionData: (question: Question) => void;
  errors?: {
    question?: string;
    answers?: string[];
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
          value={questionData.question}
          onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
          className={`w-full px-3 py-2 border ${errors?.question ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
          disabled={disabled}
        />
        {errors?.question && (
          <p className="mt-1 text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="space-y-3">
        {questionData.answers.map((answer, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name={`correctAnswer${questionNumber}`}
                checked={questionData.correctAnswer === index}
                onChange={() => setQuestionData({ ...questionData, correctAnswer: index })}
                className="text-cyan-600 focus:ring-cyan-500 h-4 w-4"
              />
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...questionData.answers];
                  newAnswers[index] = e.target.value;
                  setQuestionData({ ...questionData, answers: newAnswers });
                }}
                className={`flex-1 px-3 py-2 border ${errors?.answers?.[index] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                placeholder={`Answer ${index + 1}`}
                disabled={disabled}
              />
            </div>
            {errors?.answers?.[index] && (
              <p className="text-sm text-red-500">{errors.answers[index]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
