import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";

export function useAuthQuery() {
  const { data: session, isPending } = useSession();

  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => session,
    enabled: !isPending,
    staleTime: Infinity, // Auth session doesn't need to refetch often
  });
}
