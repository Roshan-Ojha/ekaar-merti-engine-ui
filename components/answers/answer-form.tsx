'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import { EvaluationDetails } from '@/components/answers/evaluation-details';
import { MarksDisplay } from '@/components/answers/marks-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { RichTextContent } from '@/components/ui/rich-text-content';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useSubmitAnswer } from '@/features/answer/hooks/use-submit-answer';
import type { EvaluateAnswerResult } from '@/features/answer/types';
import { parseEvaluation } from '@/features/answer/utils/parse-evaluation';
import { useQuestionSet } from '@/features/question/hooks/use-question-set';
import type { GetQuestionSetResult, QuestionSetNavigation } from '@/features/question/types';
import { ApiError } from '@/lib/api/api-manager';
import { ensureTableBorderStyles } from '@/lib/html/ensure-table-border-styles';

const answerItemSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string().min(1, 'Answer is required')
});

const submitAnswerSchema = z.object({
  answers: z.array(answerItemSchema).min(1)
});

type SubmitAnswerFormValues = z.infer<typeof submitAnswerSchema>;

function getApiErrorMessage(error: ApiError): string {
  if (error.body && typeof error.body === 'object' && 'message' in error.body && error.body.message !== undefined) {
    const { message } = error.body;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(', ');
    }
  }

  return error.message;
}

function EvaluationResult({
  result,
  questionSet
}: {
  result: EvaluateAnswerResult;
  questionSet: GetQuestionSetResult;
}) {
  const parsed = parseEvaluation(result.evaluation);
  const marksByQuestionNumber = new Map(questionSet.questions.map((question) => [question.sortOrder, question]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation complete</CardTitle>
        <CardDescription>Your answers have been evaluated against the marking rubric.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total marks (question set)</p>
          <MarksDisplay
            marksAwarded={parsed.totalMarksAwarded}
            totalMarks={questionSet.totalMarks}
            size="lg"
            className="text-foreground mt-1 block"
          />
        </div>

        <div className="space-y-4">
          {parsed.questions.map((questionResult) => {
            const question = marksByQuestionNumber.get(questionResult.questionNumber);

            return (
              <div key={questionResult.questionNumber} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-medium">Question {questionResult.questionNumber}</p>
                  <MarksDisplay
                    marksAwarded={questionResult.marksAwarded}
                    totalMarks={question?.totalMarks ?? null}
                    size="sm"
                    className="text-foreground"
                  />
                </div>
                {questionResult.generalFeedback ? (
                  <p className="text-muted-foreground mt-2 text-sm">{questionResult.generalFeedback}</p>
                ) : null}
              </div>
            );
          })}
        </div>

        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer text-sm font-medium">View evaluation details</summary>
          <EvaluationDetails evaluation={result.evaluation} questionSet={questionSet} />
        </details>
      </CardContent>
    </Card>
  );
}

export interface AnswerFormProps {
  questionSetId?: string;
}

interface QuestionSetAnswerFormProps {
  questionSet: GetQuestionSetResult;
  navigation: QuestionSetNavigation;
}

function QuestionSetAnswerForm({ questionSet, navigation }: QuestionSetAnswerFormProps) {
  const router = useRouter();
  const [evaluationResult, setEvaluationResult] = useState<EvaluateAnswerResult | null>(null);
  const { mutate: submitAnswers, isPending } = useSubmitAnswer();

  const form = useForm<SubmitAnswerFormValues>({
    resolver: zodResolver(submitAnswerSchema),
    defaultValues: {
      answers: questionSet.questions.map((question) => ({
        questionId: question.id,
        answer: ''
      }))
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'answers'
  });

  const onSubmit = form.handleSubmit((values) => {
    submitAnswers(
      {
        questionSetId: questionSet.id,
        answers: values.answers.map((answer) => ({
          ...answer,
          answer: ensureTableBorderStyles(answer.answer)
        }))
      },
      {
        onSuccess: (result) => {
          setEvaluationResult(result);
          toast.success('Answers submitted and evaluated.');
        },
        onError: (submitError) => {
          if (submitError instanceof ApiError) {
            toast.error(getApiErrorMessage(submitError));

            return;
          }

          toast.error('Failed to submit answers. Please try again.');
        }
      }
    );
  });

  const navigateToSet = (id: string | null) => {
    if (!id) {
      return;
    }

    router.push(`/questions/answer?id=${id}`);
  };

  if (evaluationResult) {
    return (
      <div className="space-y-6">
        <EvaluationResult result={evaluationResult} questionSet={questionSet} />
        <Button type="button" variant="outline" onClick={() => setEvaluationResult(null)}>
          Edit answers
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Set {navigation.index} of {navigation.total}
          </Badge>
          <Badge variant="outline">{questionSet.questions.length} question(s)</Badge>
          {questionSet.totalMarks !== null ? (
            <Badge variant="outline">Total marks: {questionSet.totalMarks}</Badge>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!navigation.previousId}
            onClick={() => navigateToSet(navigation.previousId)}>
            <ChevronLeftIcon />
            Previous set
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!navigation.nextId}
            onClick={() => navigateToSet(navigation.nextId)}>
            Next set
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-16rem)] grid-cols-1 gap-6 lg:grid-cols-2">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Scenario</CardTitle>
              <CardDescription>Read the scenario carefully before answering the questions.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-14rem)] overflow-y-auto">
              <RichTextContent html={questionSet.scenario ?? ''} />
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          {questionSet.questions.map((question) => {
            const fieldIndex = fields.findIndex((field) => field.questionId === question.id);
            const answerError = form.formState.errors.answers?.[fieldIndex]?.answer;

            return (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <CardTitle>Question {question.sortOrder}</CardTitle>
                  {question.totalMarks !== null ? <Badge variant="secondary">{question.totalMarks} marks</Badge> : null}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-md border p-4">
                    <RichTextContent html={question.question} />
                  </div>

                  <Field data-invalid={!!answerError}>
                    <FieldLabel htmlFor={`answer-${question.id}`}>Your answer</FieldLabel>
                    <FieldDescription>
                      Use the toolbar to format your response and insert tables where needed.
                    </FieldDescription>
                    {fieldIndex >= 0 ? (
                      <Controller
                        control={form.control}
                        name={`answers.${fieldIndex}.answer`}
                        render={({ field }) => (
                          <RichTextEditor
                            id={`answer-${question.id}`}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Write your answer here…"
                            minHeight="280px"
                            aria-invalid={!!answerError}
                          />
                        )}
                      />
                    ) : null}
                    <FieldError errors={[answerError]} />
                  </Field>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex items-center gap-3 pb-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isPending ? 'Evaluating answers…' : 'Submit answers'}
            </Button>
            {isPending ? (
              <p className="text-muted-foreground text-sm">This may take a minute while your answers are evaluated.</p>
            ) : null}
          </div>
        </section>
      </div>
    </form>
  );
}

export function AnswerForm({ questionSetId }: AnswerFormProps) {
  const { data, isLoading, isError, error } = useQuestionSet(questionSetId ? { id: questionSetId } : undefined);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof ApiError ? getApiErrorMessage(error) : 'Failed to load question set.';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load questions</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/questions/answer">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <QuestionSetAnswerForm key={data.questionSet.id} questionSet={data.questionSet} navigation={data.navigation} />
  );
}
