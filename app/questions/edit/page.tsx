import { redirect } from 'next/navigation';

interface LegacyEditRedirectProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function LegacyEditRedirect({ searchParams }: LegacyEditRedirectProps) {
  const { id } = await searchParams;

  if (id) {
    redirect(`/questions/${id}/edit`);
  }

  redirect('/questions/new');
}
