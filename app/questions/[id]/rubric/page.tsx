import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { RubricForm } from '@/components/rubrics/rubric-form';

interface RubricPageProps {
  params: Promise<{ id: string }>;
}

export default async function RubricPage({ params }: RubricPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    redirect('/');
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="space-y-2">
        <Link href={`/questions/${id}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to question sets
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Edit rubric</h1>
        <p className="text-muted-foreground max-w-3xl">View and edit the marking rubric JSON for this question set.</p>
      </div>

      <RubricForm questionSetId={id} />
    </main>
  );
}
