'use client';

import { useMutation } from '@tanstack/react-query';

import { answerApi } from '../api/answer.api';

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: answerApi.evaluateAnswers
  });
};
