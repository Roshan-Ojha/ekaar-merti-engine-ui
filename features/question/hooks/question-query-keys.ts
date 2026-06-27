export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  detail: (id: string) => [...questionKeys.all, 'detail', id] as const
};
