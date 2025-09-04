import { AppDataProvider, AuthGuard, TopNav } from "@/components/index";
import { OrganizationProvider } from "@/components/organization-provider";

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppDataProvider>
        <OrganizationProvider>
          <div className="grid grid-rows-[auto,1fr]">
            <TopNav />
            <div className="w-full">{children}</div>
          </div>
        </OrganizationProvider>
      </AppDataProvider>
    </AuthGuard>
  );
}
