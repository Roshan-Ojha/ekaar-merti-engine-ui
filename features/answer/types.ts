export interface AnswerItemInput {
  questionId: string;
  answer: string;
}

export interface EvaluateAnswerInput {
  questionSetId: string;
  answers: AnswerItemInput[];
}

export interface AnswerItemResult {
  questionId: string;
  questionNumber: number;
}

export interface EvaluateAnswerResult {
  questionSetId: string;
  answers: AnswerItemResult[];
  evaluation: Record<string, unknown>;
}
