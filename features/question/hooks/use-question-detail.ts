'use client';

import { useQuery } from '@tanstack/react-query';

import { questionApi } from '../api/question.api';
import type { GetQuestionDetailParams } from '../types';
import { questionKeys } from './question-query-keys';

export const useQuestionDetail = (params?: GetQuestionDetailParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: questionKeys.detail(params?.id ?? 'latest'),
    queryFn: () => questionApi.getQuestionDetail(params),
    enabled: options?.enabled ?? true
  });
};
