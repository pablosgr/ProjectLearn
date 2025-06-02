export interface ApiTestType {
  id: string;
  name: string;
  category: string;
  author_name: string;
  author_username: string;
  created_at: string;
}

export interface TestType extends ApiTestType {
  questions?: {
    id: string;
    question: string;
    answers: string[];
    correct_answer: number;
  }[];
}

export interface TestCardProps {
  test: {
    id: string;
    name: string;
    category: string;
    author_name: string;
    author_username: string;
    created_at: string;
  };
  onDelete?: (id: string) => Promise<void>;
}
