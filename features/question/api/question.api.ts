import type {
  CreateQuestionInput,
  CreateQuestionResult,
  GetQuestionSetNavigationResult,
  GetQuestionSetParams
} from '@/features/question/types';
import { apiManager } from '@/lib/api/api-manager';

const createQuestion = async (input: CreateQuestionInput): Promise<CreateQuestionResult> => {
  const response = await apiManager.apiInstance.post<CreateQuestionResult>('/v1/questions', input);

  return response.data;
};

const getQuestionSet = async (params?: GetQuestionSetParams): Promise<GetQuestionSetNavigationResult> => {
  const response = await apiManager.apiInstance.get<GetQuestionSetNavigationResult>('/v1/questions', { params });

  return response.data;
};

export const questionApi = {
  createQuestion,
  getQuestionSet
};
