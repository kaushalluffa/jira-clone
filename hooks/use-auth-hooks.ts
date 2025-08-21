import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, signOut, signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Enhanced session hook with React Query
export function useAuthSession() {
  const { data: session, isPending } = useSession();

  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => session,
    enabled: !isPending,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      user: data?.user || null,
      session: data?.session || null,
      isAuthenticated: !!data?.session?.token,
    }),
  });
}

// Sign in mutation
export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: (data) => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Redirect to dashboard or intended page
      router.push("/dashboard");
    },
  });
}

// Sign up mutation
export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
    },
  });
}

// Sign out mutation
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      // Clear all queries when signing out
      queryClient.clear();
      router.push("/login");
    },
  });
}

// Hook to require authentication
export function useRequireAuth() {
  const { data: authData, isLoading } = useAuthSession();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isLoading && !authData?.isAuthenticated) {
    router.push("/login");
  }

  return {
    isAuthenticated: authData?.isAuthenticated || false,
    user: authData?.user || null,
    isLoading,
  };
}
