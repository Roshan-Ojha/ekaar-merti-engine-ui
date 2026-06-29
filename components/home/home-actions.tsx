'use client';

import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useQuestionSet } from '@/features/question/hooks/use-question-set';

export function HomeActions() {
  const { data, isLoading } = useQuestionSet();

  const browseHref = data ? `/questions/${data.questionSet.id}` : '/questions/new';
  const answerHref = data ? `/questions/${data.questionSet.id}/answer` : '/questions/new';

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild>
        <Link href="/questions/new">Create question set</Link>
      </Button>
      {isLoading ? (
        <>
          <Button variant="outline" disabled>
            <Loader2Icon className="animate-spin" />
            Browse question sets
          </Button>
          <Button variant="outline" disabled>
            <Loader2Icon className="animate-spin" />
            Answer questions
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link href={browseHref}>Browse question sets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={answerHref}>Answer questions</Link>
          </Button>
        </>
      )}
    </div>
  );
}
