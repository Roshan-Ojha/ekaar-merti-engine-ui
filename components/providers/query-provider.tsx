'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { apiManager } from '@/lib/api/api-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    apiManager.initializeApi(API_BASE_URL);

    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1
        }
      }
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
