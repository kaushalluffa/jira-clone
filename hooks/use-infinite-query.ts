import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

export function useInfiniteApiQuery<T = any>(
  key: string | string[],
  endpoint: string,
  options?: {
    pageSize?: number;
    enabled?: boolean;
    select?: (data: any) => T;
  }
) {
  const api = useApiClient();
  const { data: session } = useSession();
  const pageSize = options?.pageSize || 10;

  return useInfiniteQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: ({ pageParam = 0 }) =>
      api.get(`${endpoint}?page=${pageParam}&limit=${pageSize}`),
    enabled: !!session?.session?.token && (options?.enabled ?? true),
    getNextPageParam: (lastPage, allPages) => {
      // Assuming your API returns hasMore or similar
      return lastPage?.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    select: options?.select,
  });
}
