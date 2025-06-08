export interface TestOption {
  id: number;
  option_text: string;
  is_correct: boolean;
  index_order: number;
}

export interface TestQuestion {
  id: number;
  question_text: string;
  type: string | null;
  options: TestOption[];
}

export interface TestType {
  id: number;
  name: string;
  category_id: number;
  category: string;
  author_name: string;
  author_username: string;
  created_at: string;
  questions: TestQuestion[];
}

export interface AssignedTest {
  test_id: number;
  test_name: string;
  test_category: string;
  unit_id: number | null;
  unit_name: string | null;
  assigned_at: string;
  due_date: string | null;
  time_limit: number | null;
  visibility: boolean;
  is_mandatory: boolean;
}

export interface TestResult {
  user: string;
  class: number;
  test: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: 'completed' | 'in_progress';
  started_at: string;
  ended_at: string;
}

export interface TestResultResponse {
  id: number;
  student: string;
  classroom: string;
  test: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: string;
  started_at: string;
  ended_at: string;
}
