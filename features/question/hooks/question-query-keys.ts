export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  set: (id: string) => [...questionKeys.all, 'set', id] as const,
  detail: (id: string) => [...questionKeys.all, 'detail', id] as const
};
