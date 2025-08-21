import { useApiClient } from "@/lib/api-client";
import { signOut, useSession } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useApiQuery<T = any>(
  key: string | string[],
  endpoint: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchInterval?: number;
    select?: (data: any) => T;
    onError?: (error: any) => void;
  }
) {
  const api = useApiClient();
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => api.get(endpoint),
    enabled: !!session?.session?.token && (options?.enabled ?? true),
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
    refetchInterval: options?.refetchInterval,
    select: options?.select,
  });
  useEffect(() => {
    if (query.error) {
      const error = query.error as any;

      if (error?.status === 401) {
        // Clear all queries and sign out
        queryClient.clear();
        signOut();
        router.push("/login");
      }

      options?.onError?.(error);
    }
  }, [query.error, router, queryClient, options]);
  return query;
}

export function useApiMutation<T = any>(options?: {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  invalidateQueries?: string | string[];
}) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleAuthError = (error: any) => {
    if (error?.status === 401) {
      queryClient.clear();
      signOut();
      router.push("/login");
    }
    options?.onError?.(error);
  };

  const handleSuccess = (data: T) => {
    if (options?.invalidateQueries) {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(options.invalidateQueries)
          ? options.invalidateQueries
          : [options.invalidateQueries],
      });
    }
    options?.onSuccess?.(data);
  };
  return {
    post: useMutation({
      mutationFn: ({ endpoint, body }: { endpoint: string; body?: any }) =>
        api.post(endpoint, body),
      onSuccess: handleSuccess,
      onError: handleAuthError,
    }),
    delete: useMutation({
      mutationFn: ({ endpoint }: { endpoint: string }) => api.delete(endpoint),
      onSuccess: handleSuccess,
      onError: handleAuthError,
    }),
    put: useMutation({
      mutationFn: ({ endpoint, body }: { endpoint: string; body?: any }) =>
        api.put(endpoint, body),
      onSuccess: handleSuccess,
      onError: handleAuthError,
    }),
  };
}
