import Link from 'next/link';

import { QuestionSetList } from '@/components/questions/question-set-list';

interface QuestionsPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
      <div className="space-y-2">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to home
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Question sets</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse scenario-based question sets. Use the navigation to move between sets, or open a set to edit or answer.
        </p>
      </div>

      <QuestionSetList questionSetId={id} />
    </main>
  );
}
