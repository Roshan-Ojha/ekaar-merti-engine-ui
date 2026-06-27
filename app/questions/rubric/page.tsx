import Link from 'next/link';

import { RubricForm } from '@/components/rubrics/rubric-form';

interface RubricPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function RubricPage({ searchParams }: RubricPageProps) {
  const { id } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="space-y-2">
        <Link href="/questions" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to question sets
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Edit rubric</h1>
        <p className="text-muted-foreground max-w-3xl">
          View and edit the marking rubric JSON for a question set. Saving updates the rubric file directly.
        </p>
      </div>

      <RubricForm questionSetId={id} />
    </main>
  );
}
