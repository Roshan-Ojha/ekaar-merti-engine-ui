import { redirect } from 'next/navigation';

interface LegacyRubricRedirectProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function LegacyRubricRedirect({ searchParams }: LegacyRubricRedirectProps) {
  const { id } = await searchParams;

  if (id) {
    redirect(`/questions/${id}/rubric`);
  }

  redirect('/');
}
