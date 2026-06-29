'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useQuestionSet } from '@/features/question/hooks/use-question-set';
import type { GetQuestionSetResult, QuestionSetNavigation } from '@/features/question/types';
import { useRubric } from '@/features/rubric/hooks/use-rubric';
import { useUpdateRubric } from '@/features/rubric/hooks/use-update-rubric';
import type { RubricResult } from '@/features/rubric/types';
import { formatRubricJson, parseRubricJson } from '@/features/rubric/utils/parse-rubric-json';
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

interface RubricEditorProps {
  rubric: RubricResult;
  navigation: QuestionSetNavigation;
  questionSet: GetQuestionSetResult;
}

function RubricEditor({ rubric, navigation, questionSet }: RubricEditorProps) {
  const router = useRouter();
  const [jsonText, setJsonText] = useState(() => formatRubricJson(rubric.rubric));
  const [parseError, setParseError] = useState<string | null>(null);
  const { mutate: updateRubric, isPending } = useUpdateRubric(rubric.questionSetId);

  const navigateToSet = (id: string | null) => {
    if (!id) {
      return;
    }

    router.push(`/questions/${id}/rubric`);
  };

  const handleReset = () => {
    setJsonText(formatRubricJson(rubric.rubric));
    setParseError(null);
  };

  const handleSave = () => {
    const result = parseRubricJson(jsonText);

    if ('error' in result) {
      setParseError(result.error);

      return;
    }

    setParseError(null);

    updateRubric(result.rubric, {
      onSuccess: (data) => {
        setJsonText(formatRubricJson(data.rubric));
        toast.success('Rubric saved.');
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(getApiErrorMessage(error));

          return;
        }

        toast.error('Failed to save rubric. Please try again.');
      }
    });
  };

  const isDirty = jsonText !== formatRubricJson(rubric.rubric);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Set {navigation.index} of {navigation.total}
          </Badge>
          <Badge variant="outline">Rubric: {rubric.rubricPath}</Badge>
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

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/questions/${questionSet.id}`}>View question set</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/questions/${questionSet.id}/edit`}>Edit questions</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marking rubric</CardTitle>
          <CardDescription>
            View and edit the rubric JSON used for answer evaluation. Changes are saved directly without regenerating
            from the LLM.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jsonText}
            onChange={(event) => {
              setJsonText(event.target.value);
              setParseError(null);
            }}
            spellCheck={false}
            className="min-h-[32rem] font-mono text-xs leading-relaxed"
            aria-invalid={!!parseError}
          />

          {parseError ? <p className="text-destructive text-sm">{parseError}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleSave} disabled={isPending || !isDirty}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isPending ? 'Saving…' : 'Save rubric'}
            </Button>
            <Button type="button" variant="outline" disabled={!isDirty || isPending} onClick={handleReset}>
              Reset changes
            </Button>
            {isDirty ? <p className="text-muted-foreground text-sm">You have unsaved changes.</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export interface RubricFormProps {
  questionSetId?: string;
}

export function RubricForm({ questionSetId }: RubricFormProps) {
  const {
    data: questionSetData,
    isLoading: isQuestionSetLoading,
    isError: isQuestionSetError,
    error: questionSetError
  } = useQuestionSet(questionSetId ? { id: questionSetId } : undefined);

  const activeQuestionSetId = questionSetData?.questionSet.id ?? '';

  const {
    data: rubricData,
    isLoading: isRubricLoading,
    isError: isRubricError,
    error: rubricError
  } = useRubric(activeQuestionSetId, { enabled: !!activeQuestionSetId });

  const isLoading = isQuestionSetLoading || (!!activeQuestionSetId && isRubricLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  if (isQuestionSetError) {
    const message =
      questionSetError instanceof ApiError ? getApiErrorMessage(questionSetError) : 'Failed to load question set.';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load question set</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href={`/questions/${questionSetId}/rubric`}>Try again</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isRubricError) {
    const message = rubricError instanceof ApiError ? getApiErrorMessage(rubricError) : 'Failed to load rubric.';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load rubric</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href={`/questions/${questionSetId}/rubric`}>Try again</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!questionSetData || !rubricData) {
    return null;
  }

  return (
    <RubricEditor
      key={rubricData.questionSetId}
      rubric={rubricData}
      navigation={questionSetData.navigation}
      questionSet={questionSetData.questionSet}
    />
  );
}
