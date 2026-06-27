'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { questionApi } from '../api/question.api';
import { questionKeys } from './question-query-keys';

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.createQuestion,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: questionKeys.all });
    }
  });
};
