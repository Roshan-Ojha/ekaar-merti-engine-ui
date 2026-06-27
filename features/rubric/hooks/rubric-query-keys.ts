export const rubricKeys = {
  all: ['rubrics'] as const,
  detail: (questionSetId: string) => [...rubricKeys.all, questionSetId] as const
};
