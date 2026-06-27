import type { CreateQuestionInput, CreateQuestionResult } from '@/features/question/types';
import { apiManager } from '@/lib/api/api-manager';

const createQuestion = async (input: CreateQuestionInput): Promise<CreateQuestionResult> => {
  const response = await apiManager.apiInstance.post<CreateQuestionResult>('/v1/questions', input);

  return response.data;
};

export const questionApi = {
  createQuestion
};
