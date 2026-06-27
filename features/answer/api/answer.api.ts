import type { EvaluateAnswerInput, EvaluateAnswerResult } from '@/features/answer/types';
import { apiManager } from '@/lib/api/api-manager';

const evaluateAnswers = async (input: EvaluateAnswerInput): Promise<EvaluateAnswerResult> => {
  const response = await apiManager.apiInstance.post<EvaluateAnswerResult>('/v1/answers', input);

  return response.data;
};

export const answerApi = {
  evaluateAnswers
};
