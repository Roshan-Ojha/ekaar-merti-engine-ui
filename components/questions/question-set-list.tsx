'use client';

import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextContent } from '@/components/ui/rich-text-content';
import { useQuestionSet } from '@/features/question/hooks/use-question-set';
import type { GetQuestionSetResult, QuestionSetNavigation } from '@/features/question/types';
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

interface QuestionSetListViewProps {
  questionSet: GetQuestionSetResult;
  navigation: QuestionSetNavigation;
}

function QuestionSetListView({ questionSet, navigation }: QuestionSetListViewProps) {
  const router = useRouter();

  const navigateToSet = (id: string | null) => {
    if (!id) {
      return;
    }

    router.push(`/questions?id=${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
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

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={`/questions/edit?id=${questionSet.id}`}>Edit question set</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/questions/rubric?id=${questionSet.id}`}>Edit rubric</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/questions/answer?id=${questionSet.id}`}>Answer questions</Link>
        </Button>
      </div>

      <div className="grid min-h-[calc(100vh-16rem)] grid-cols-1 gap-6 lg:grid-cols-2">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Scenario</CardTitle>
              <CardDescription>Shared scenario for all questions in this set.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-14rem)] overflow-y-auto">
              <RichTextContent html={questionSet.scenario ?? ''} />
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          {questionSet.questions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle>Question {question.sortOrder}</CardTitle>
                {question.totalMarks !== null ? <Badge variant="secondary">{question.totalMarks} marks</Badge> : null}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4">
                  <RichTextContent html={question.question} />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

export interface QuestionSetListProps {
  questionSetId?: string;
}

export function QuestionSetList({ questionSetId }: QuestionSetListProps) {
  const { data, isLoading, isError, error } = useQuestionSet(questionSetId ? { id: questionSetId } : undefined);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof ApiError ? getApiErrorMessage(error) : 'Failed to load question sets.';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load question sets</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/questions">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return <QuestionSetListView key={data.questionSet.id} questionSet={data.questionSet} navigation={data.navigation} />;
}
