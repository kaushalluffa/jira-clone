import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

// Hook for optimistic updates
export function useOptimisticMutation<T = any>(
  queryKey: string | string[],
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any, variables: any, context: any) => void;
  }
) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return {
    // Optimistic create
    create: useMutation({
      mutationFn: ({ endpoint, body }: { endpoint: string; body: any }) =>
        api.post(endpoint, body),
      onMutate: async ({ body }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: key });

        // Snapshot previous value
        const previousData = queryClient.getQueryData(key);

        // Optimistically update
        queryClient.setQueryData(key, (old: any[]) => [
          ...(old || []),
          { ...body, id: Date.now(), isOptimistic: true },
        ]);

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousData) {
          queryClient.setQueryData(key, context.previousData);
        }
        options?.onError?.(err, variables, context);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: key });
      },
      onSuccess: options?.onSuccess,
    }),

    // Optimistic update
    update: useMutation({
      mutationFn: ({
        endpoint,
        body,
        id,
      }: {
        endpoint: string;
        body: any;
        id: string;
      }) => api.put(endpoint, body),
      onMutate: async ({ body, id }) => {
        await queryClient.cancelQueries({ queryKey: key });
        const previousData = queryClient.getQueryData(key);

        queryClient.setQueryData(
          key,
          (old: any[]) =>
            old?.map((item) =>
              item.id === id ? { ...item, ...body } : item
            ) || []
        );

        return { previousData };
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(key, context.previousData);
        }
        options?.onError?.(err, variables, context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: key });
      },
      onSuccess: options?.onSuccess,
    }),

    // Optimistic delete
    delete: useMutation({
      mutationFn: ({ endpoint, id }: { endpoint: string; id: string }) =>
        api.delete(endpoint),
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: key });
        const previousData = queryClient.getQueryData(key);

        queryClient.setQueryData(
          key,
          (old: any[]) => old?.filter((item) => item.id !== id) || []
        );

        return { previousData };
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(key, context.previousData);
        }
        options?.onError?.(err, variables, context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: key });
      },
      onSuccess: options?.onSuccess,
    }),
  };
}
