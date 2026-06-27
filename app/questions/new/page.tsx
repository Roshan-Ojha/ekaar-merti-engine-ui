import Link from 'next/link';

import { QuestionForm } from '@/components/questions/question-form';

export default function NewQuestionPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="space-y-2">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Create question set</h1>
        <p className="max-w-3xl text-muted-foreground">
          Post a scenario with one or more questions. The merit engine will generate a marking rubric via the API.
        </p>
      </div>

      <QuestionForm />
    </main>
  );
}
