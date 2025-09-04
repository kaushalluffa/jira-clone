import { useState, useEffect, useCallback } from "react";
import { useSession, signOut, signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function useAuthSession() {
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<{
    user: any;
    session: any;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!isPending) {
      setState({
        user: session?.user ?? null,
        session: session?.session ?? null,
        isAuthenticated: !!session?.session?.token,
        isLoading: false,
      });
    }
  }, [session, isPending]);
  return state;
}

// Sign in hook
export function useSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInHandler = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message ?? "Unknown error");
          setLoading(false);
          return { error: result.error };
        }
        router.push("/dashboard");
        setLoading(false);
        return result;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
        return { error: err };
      }
    },
    [router]
  );

  return { signIn: signInHandler, loading, error };
}

// Sign up hook
export function useSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUpHandler = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await signUp.email({ email, password, name });
        if (result.error) {
          setError(result.error.message ?? "Unknown error");
          setLoading(false);
          return { error: result.error };
        }
        router.push("/dashboard");
        setLoading(false);
        return result;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
        return { error: err };
      }
    },
    [router]
  );

  return { signUp: signUpHandler, loading, error };
}

// Sign out hook
export function useSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOutHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      router.push("/sign-in");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setLoading(false);
    }
  }, [router]);

  return { signOut: signOutHandler, loading, error };
}

// Hook to require authentication
export function useRequireAuth() {
  const { isAuthenticated, user, isLoading } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    isAuthenticated: isAuthenticated || false,
    user: user || null,
    isLoading,
  };
}
