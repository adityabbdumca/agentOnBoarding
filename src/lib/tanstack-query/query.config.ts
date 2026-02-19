// Add configuration for tanstack query
import { QueryClient } from "@tanstack/react-query";

export const queryClientGlobal = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, 
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});