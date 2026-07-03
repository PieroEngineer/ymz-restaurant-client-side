import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Enterprise caching configuration optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents reloading data every time you change browser tabs
      retry: 1,                    // Only retry a failed network request once before throwing UI error
      staleTime: 1000 * 60 * 5,     // Consider data fresh for 5 minutes inside local cache
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>  {/* Continue here: Ask to AI where does the websockets wrapper goes if the Queryclient is already wrapping (Maybe reformulate question) */}
      {children}
    </QueryClientProvider>
  );
}