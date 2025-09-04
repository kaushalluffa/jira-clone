'use client'
import { useAuthSession } from "@/hooks/use-auth-hooks";
import { useRouter } from "next/navigation";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const router = useRouter()
  const session = useAuthSession()
  if (session?.isAuthenticated) {
   return router.push("/orgs")
 }

  return <div className="grid min-h-screen place-items-center">{children}</div>;
}
