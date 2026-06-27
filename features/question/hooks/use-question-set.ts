'use client';

import { useQuery } from '@tanstack/react-query';

import { questionApi } from '../api/question.api';
import type { GetQuestionSetParams } from '../types';
import { questionKeys } from './question-query-keys';

export const useQuestionSet = (params?: GetQuestionSetParams) => {
  return useQuery({
    queryKey: questionKeys.detail(params?.id ?? 'latest'),
    queryFn: () => questionApi.getQuestionSet(params)
  });
};
