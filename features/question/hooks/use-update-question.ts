'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { questionApi } from '../api/question.api';
import type { UpdateQuestionInput } from '../types';
import { questionKeys } from './question-query-keys';

export const useUpdateQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateQuestionInput) => questionApi.updateQuestion(questionSetId, input),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: questionKeys.all });
    }
  });
};
