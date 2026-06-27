import { z } from 'zod';

export const questionItemSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answerTips: z.string().min(1, 'Answer tips are required'),
  markingScheme: z.string().min(1, 'Marking scheme is required'),
  examinerComments: z.string().min(1, 'Examiner comments are required'),
  suggestedAnswer: z.string().min(1, 'Suggested answer is required')
});

export const createQuestionSchema = z.object({
  scenario: z.string().optional(),
  questions: z.array(questionItemSchema).min(1, 'At least one question is required')
});

export type CreateQuestionFormValues = z.infer<typeof createQuestionSchema>;

export const emptyQuestionItem = (): CreateQuestionFormValues['questions'][number] => ({
  question: '',
  answerTips: '',
  markingScheme: '',
  examinerComments: '',
  suggestedAnswer: ''
});
