'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rubricApi } from '../api/rubric.api';
import { rubricKeys } from './rubric-query-keys';

import { questionKeys } from '@/features/question/hooks/question-query-keys';

export const useUpdateRubric = (questionSetId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rubric: Record<string, unknown>) => rubricApi.updateRubric(questionSetId, rubric),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: rubricKeys.detail(questionSetId) }),
        queryClient.invalidateQueries({ queryKey: questionKeys.all })
      ]);
    }
  });
};
