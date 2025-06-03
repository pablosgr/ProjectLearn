export interface Question {
    id?: number;
    question: string;
    answers: string[];
    correctAnswer: number;
}
export interface ApiQuestionType {
  id: string;
  test: string;
  question_text: string;
  type: string;
}
export interface QuestionError {
  question?: string;
  answers?: string[];
}
