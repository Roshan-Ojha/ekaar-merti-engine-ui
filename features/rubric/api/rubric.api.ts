import type { RubricResult } from '@/features/rubric/types';
import { apiManager } from '@/lib/api/api-manager';

const getRubric = async (questionSetId: string): Promise<RubricResult> => {
  const response = await apiManager.apiInstance.get<RubricResult>(`/v1/rubrics/${questionSetId}`);

  return response.data;
};

const updateRubric = async (questionSetId: string, rubric: Record<string, unknown>): Promise<RubricResult> => {
  const response = await apiManager.apiInstance.patch<RubricResult>(`/v1/rubrics/${questionSetId}`, rubric);

  return response.data;
};

export const rubricApi = {
  getRubric,
  updateRubric
};
