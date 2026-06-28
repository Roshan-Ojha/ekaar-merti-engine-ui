'use client';

import { useQuery } from '@tanstack/react-query';

import { rubricApi } from '../api/rubric.api';
import { rubricKeys } from './rubric-query-keys';

export const useRubric = (questionSetId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: rubricKeys.detail(questionSetId),
    queryFn: () => rubricApi.getRubric(questionSetId),
    enabled: (options?.enabled ?? true) && !!questionSetId
  });
};
