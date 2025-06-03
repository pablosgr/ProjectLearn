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
  category: string;
  author_name: string;
  author_username: string;
  created_at: string;
  questions: TestQuestion[];
}

export interface TestDetailType extends TestType {
  category_id?: number;
}
