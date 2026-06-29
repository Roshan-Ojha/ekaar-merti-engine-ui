import { redirect } from 'next/navigation';

interface QuestionsPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const { id } = await searchParams;

  if (id) {
    redirect(`/questions/${id}`);
  }

  redirect('/');
}
