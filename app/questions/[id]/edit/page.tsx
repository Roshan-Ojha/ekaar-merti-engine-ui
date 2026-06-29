import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { QuestionForm } from '@/components/questions/question-form';

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
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
        <h1 className="text-3xl font-semibold tracking-tight">Edit question set</h1>
        <p className="text-muted-foreground max-w-3xl">
          Update the scenario and questions. Saving will regenerate the marking rubric via the API.
        </p>
      </div>

      <QuestionForm questionSetId={id} />
    </main>
  );
}
