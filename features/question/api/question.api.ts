import type {
  CreateQuestionInput,
  CreateQuestionResult,
  GetQuestionDetailParams,
  GetQuestionDetailResult,
  GetQuestionSetNavigationResult,
  GetQuestionSetParams,
  UpdateQuestionInput,
  UpdateQuestionResult
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

const getQuestionDetail = async (params?: GetQuestionDetailParams): Promise<GetQuestionDetailResult> => {
  const response = await apiManager.apiInstance.get<GetQuestionDetailResult>('/v1/questions/detail', { params });

  return response.data;
};

const updateQuestion = async (id: string, input: UpdateQuestionInput): Promise<UpdateQuestionResult> => {
  const response = await apiManager.apiInstance.patch<UpdateQuestionResult>(`/v1/questions/${id}`, input);

  return response.data;
};

export const questionApi = {
  createQuestion,
  getQuestionSet,
  getQuestionDetail,
  updateQuestion
};
