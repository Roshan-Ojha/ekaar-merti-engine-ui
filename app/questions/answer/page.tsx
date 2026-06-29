import { redirect } from 'next/navigation';

interface LegacyAnswerPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function LegacyAnswerPage({ searchParams }: LegacyAnswerPageProps) {
  const { id } = await searchParams;

  if (id) {
    redirect(`/questions/${id}/answer`);
  }

  redirect('/');
}
