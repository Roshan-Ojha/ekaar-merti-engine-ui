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
