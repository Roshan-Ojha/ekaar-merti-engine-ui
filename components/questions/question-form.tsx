'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useCreateQuestion } from '@/features/question/hooks/use-create-question';
import { useQuestionDetail } from '@/features/question/hooks/use-question-detail';
import { useUpdateQuestion } from '@/features/question/hooks/use-update-question';
import type { EditQuestionFormValues } from '@/features/question/schemas/create-question.schema';
import {
  createQuestionSchema,
  editQuestionSchema,
  emptyQuestionItem
} from '@/features/question/schemas/create-question.schema';
import type { CreateQuestionResult, GetQuestionDetailSet, QuestionSetNavigation } from '@/features/question/types';
import { ApiError } from '@/lib/api/api-manager';

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

function QuestionResult({ result, mode }: { result: CreateQuestionResult; mode: 'create' | 'edit' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Question set created' : 'Question set updated'}</CardTitle>
        <CardDescription>
          Rubric {mode === 'create' ? 'generated' : 'regenerated'} and saved. Question set ID:{' '}
          <code className="text-xs">{result.id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{result.questions.length} question(s)</Badge>
          <Badge variant="outline">Rubric: {result.rubricPath}</Badge>
        </div>

        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer text-sm font-medium">View generated rubric</summary>
          <pre className="bg-muted mt-4 max-h-96 overflow-auto rounded-md p-4 text-xs">
            {JSON.stringify(result.rubric, null, 2)}
          </pre>
        </details>

        <Button asChild variant="outline" size="sm">
          <Link href={`/questions/rubric?id=${result.id}`}>Edit rubric</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const questionFields = [
  { name: 'question', label: 'Question', description: 'Question prompt, including tables where needed.' },
  { name: 'answerTips', label: 'Answer tips', description: 'Guidance for candidates on how to approach the answer.' },
  {
    name: 'markingScheme',
    label: 'Marking scheme',
    description: 'Use the table tool to describe how marks are allocated.'
  },
  {
    name: 'examinerComments',
    label: 'Examiner comments',
    description: 'Notes on common mistakes and marking approach.'
  },
  { name: 'suggestedAnswer', label: 'Suggested answer', description: 'Model answer with formatted text and tables.' }
] as const;

interface QuestionSetFormProps {
  mode: 'create' | 'edit';
  questionSet?: GetQuestionDetailSet;
  navigation?: QuestionSetNavigation;
}

function QuestionSetForm({ mode, questionSet, navigation }: QuestionSetFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<CreateQuestionResult | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion(questionSet?.id ?? '');
  const isPending = mode === 'create' ? isCreating : isUpdating;

  const form = useForm<EditQuestionFormValues>({
    resolver: zodResolver(mode === 'create' ? createQuestionSchema : editQuestionSchema),
    defaultValues:
      mode === 'edit' && questionSet
        ? {
            scenario: questionSet.scenario ?? '',
            questions: questionSet.questions.map((question) => ({
              id: question.id,
              question: question.question,
              answerTips: question.answerTips,
              markingScheme: question.markingScheme,
              examinerComments: question.examinerComments,
              suggestedAnswer: question.suggestedAnswer
            }))
          }
        : {
            scenario: '',
            questions: [emptyQuestionItem()]
          }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  });

  const onSubmit = form.handleSubmit((values) => {
    const scenario = values.scenario?.trim() ? values.scenario : undefined;

    if (mode === 'create') {
      createQuestion(
        { scenario, questions: values.questions },
        {
          onSuccess: (data) => {
            setResult(data);
            toast.success('Question set created and rubric generated.');
          },
          onError: (error) => {
            if (error instanceof ApiError) {
              toast.error(getApiErrorMessage(error));

              return;
            }

            toast.error('Failed to create question set. Please try again.');
          }
        }
      );

      return;
    }

    updateQuestion(
      {
        scenario,
        questions: values.questions.map((question) => ({
          ...(question.id ? { id: question.id } : {}),
          question: question.question,
          answerTips: question.answerTips,
          markingScheme: question.markingScheme,
          examinerComments: question.examinerComments,
          suggestedAnswer: question.suggestedAnswer
        }))
      },
      {
        onSuccess: (data) => {
          setResult(data);
          toast.success('Question set updated and rubric regenerated.');
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(getApiErrorMessage(error));

            return;
          }

          toast.error('Failed to update question set. Please try again.');
        }
      }
    );
  });

  const navigateToSet = (id: string | null) => {
    if (!id) {
      return;
    }

    router.push(`/questions/edit?id=${id}`);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <QuestionResult result={result} mode={mode} />
        {mode === 'create' ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setResult(null);
              form.reset({
                scenario: '',
                questions: [emptyQuestionItem()]
              });
              setFormKey((current) => current + 1);
            }}>
            Create another question set
          </Button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setResult(null)}>
              Continue editing
            </Button>
            <Button asChild variant="outline">
              <Link href="/questions">Browse question sets</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form key={formKey} onSubmit={onSubmit} className="space-y-8">
      {mode === 'edit' && navigation ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              Set {navigation.index} of {navigation.total}
            </Badge>
            <Badge variant="outline">{questionSet?.questions.length ?? 0} question(s)</Badge>
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
      ) : null}

      <FieldSet>
        <FieldLegend>Scenario</FieldLegend>
        <FieldDescription>
          Shared scenario shown before all questions in this set. Use headings, lists, and tables as needed.
        </FieldDescription>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.scenario}>
            <FieldLabel htmlFor="scenario">Scenario content</FieldLabel>
            <Controller
              control={form.control}
              name="scenario"
              render={({ field }) => (
                <RichTextEditor
                  id="scenario"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Enter the exam scenario…"
                  minHeight="280px"
                  aria-invalid={!!form.formState.errors.scenario}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.scenario]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Questions</h2>
            <p className="text-muted-foreground text-sm">Add one or more questions linked to the scenario above.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append(emptyQuestionItem())}>
            <PlusIcon />
            Add question
          </Button>
        </div>

        {form.formState.errors.questions?.root?.message ? (
          <p className="text-destructive text-sm">{form.formState.errors.questions.root.message}</p>
        ) : null}

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Question {index + 1}</CardTitle>
                <CardDescription>Use the toolbar to format text and insert tables.</CardDescription>
              </div>
              {fields.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove question ${index + 1}`}
                  onClick={() => remove(index)}>
                  <Trash2Icon />
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {questionFields.map((questionField) => {
                const fieldName = `questions.${index}.${questionField.name}` as const;
                const error = form.formState.errors.questions?.[index]?.[questionField.name];
                const fieldId = `question-${index}-${questionField.name}`;

                return (
                  <Field key={fieldName} data-invalid={!!error}>
                    <FieldLabel htmlFor={fieldId}>{questionField.label}</FieldLabel>
                    <FieldDescription>{questionField.description}</FieldDescription>
                    <Controller
                      control={form.control}
                      name={fieldName}
                      render={({ field: controllerField }) => (
                        <RichTextEditor
                          id={fieldId}
                          value={controllerField.value}
                          onChange={controllerField.onChange}
                          placeholder={`Enter ${questionField.label.toLowerCase()}…`}
                          minHeight={questionField.name === 'suggestedAnswer' ? '320px' : '220px'}
                          aria-invalid={!!error}
                        />
                      )}
                    />
                    <FieldError errors={[error]} />
                  </Field>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : null}
          {isPending
            ? mode === 'create'
              ? 'Generating rubric…'
              : 'Regenerating rubric…'
            : mode === 'create'
              ? 'Create question set'
              : 'Save question set'}
        </Button>
        {isPending ? (
          <p className="text-muted-foreground text-sm">
            This may take a minute while the rubric is {mode === 'create' ? 'generated' : 'regenerated'}.
          </p>
        ) : null}
      </div>
    </form>
  );
}

export interface QuestionFormProps {
  questionSetId?: string;
}

export function QuestionForm({ questionSetId }: QuestionFormProps) {
  const isEditMode = !!questionSetId;
  const { data, isLoading, isError, error } = useQuestionDetail(isEditMode ? { id: questionSetId } : undefined, {
    enabled: isEditMode
  });

  if (isEditMode && isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  if (isEditMode && isError) {
    const message = error instanceof ApiError ? getApiErrorMessage(error) : 'Failed to load question set.';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load question set</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/questions/edit">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isEditMode && !data) {
    return null;
  }

  return (
    <QuestionSetForm
      key={isEditMode ? data?.questionSet.id : 'create'}
      mode={isEditMode ? 'edit' : 'create'}
      questionSet={data?.questionSet}
      navigation={data?.navigation}
    />
  );
}
