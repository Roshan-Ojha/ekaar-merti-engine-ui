export interface QuestionItemInput {
  question: string;
  answerTips: string;
  markingScheme: string;
  examinerComments: string;
  suggestedAnswer: string;
}

export interface CreateQuestionInput {
  scenario?: string;
  questions: QuestionItemInput[];
}

export interface QuestionItemResult {
  id: string;
  sortOrder: number;
  question: string;
  answerTips: string;
  markingScheme: string;
  examinerComments: string;
  suggestedAnswer: string;
}

export interface CreateQuestionResult {
  id: string;
  scenario: string | null;
  rubricPath: string;
  rubric: Record<string, unknown>;
  questions: QuestionItemResult[];
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionItem {
  id: string;
  sortOrder: number;
  question: string;
  totalMarks: number | null;
}

export interface GetQuestionSetResult {
  id: string;
  scenario: string | null;
  totalMarks: number | null;
  questions: GetQuestionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSetNavigation {
  previousId: string | null;
  nextId: string | null;
  index: number;
  total: number;
}

export interface GetQuestionSetNavigationResult {
  questionSet: GetQuestionSetResult;
  navigation: QuestionSetNavigation;
}

export interface GetQuestionSetParams {
  id?: string;
  direction?: 'next' | 'previous';
}

export interface GetQuestionDetailItem {
  id: string;
  sortOrder: number;
  question: string;
  answerTips: string;
  markingScheme: string;
  examinerComments: string;
  suggestedAnswer: string;
}

export interface GetQuestionDetailSet {
  id: string;
  scenario: string | null;
  questions: GetQuestionDetailItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionDetailResult {
  questionSet: GetQuestionDetailSet;
  navigation: QuestionSetNavigation;
}

export interface GetQuestionDetailParams {
  id?: string;
  direction?: 'next' | 'previous';
  index?: number;
}

export interface UpdateQuestionItemInput extends QuestionItemInput {
  id?: string;
}

export interface UpdateQuestionInput {
  scenario?: string;
  questions?: UpdateQuestionItemInput[];
}

export type UpdateQuestionResult = CreateQuestionResult;
