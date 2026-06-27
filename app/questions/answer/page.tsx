import Link from 'next/link';

import { AnswerForm } from '@/components/answers/answer-form';

interface AnswerPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AnswerPage({ searchParams }: AnswerPageProps) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
      <div className="space-y-2">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to home
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Answer questions</h1>
        <p className="text-muted-foreground max-w-3xl">
          Read the scenario on the left and write your answers on the right. Submit when you are ready for evaluation.
        </p>
      </div>

      <AnswerForm questionSetId={id} />
    </main>
  );
}
