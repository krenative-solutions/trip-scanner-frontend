import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * - Retry failed requests once
 * - Don't refetch on window focus (flight data changes slowly)
 * - Cache results for 5 minutes (flight prices are relatively stable)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
    },
    mutations: {
      retry: false, // Don't retry mutations (POST requests)
    },
  },
});