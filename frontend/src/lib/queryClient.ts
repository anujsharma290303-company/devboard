import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
            staleTime: 1000 * 60, // 1 minute
        },
        mutations: {
            retry: 1,
        },
    },
});