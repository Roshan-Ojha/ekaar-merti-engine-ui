import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <div className="max-w-lg space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">Ekaar Merit Engine</h1>
          <p className="text-muted-foreground">Create scenario-based question sets and answer exam questions.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/questions/new">Create question set</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/questions/answer">Answer questions</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
