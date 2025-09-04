"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, useParams } from "next/navigation";

import type { Organization } from "@/lib/types";
import useOrganizations from "@/hooks/use-organizations";

type OrganizationContextType = {
  organizations: Organization[];
  currentOrganization?: Organization;
  setCurrentOrganization: (org?: Organization) => void;
  loading: boolean;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getOrganizations } = useOrganizations();
  const [currentOrganization, setCurrentOrganizationState] = useState<
    Organization | undefined
  >(undefined);
  const router = useRouter();
  const params = useParams();

  // Fetch organizations once on mount, optimized for React 19
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrganizations()
      .then((orgs: { organizations: Organization[] }) => {
        if (!cancelled) setOrganizations(orgs?.organizations);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Set current org based on URL (e.g. /orgs/[id])
  useEffect(() => {
    if (!organizations?.length) return;
    if (params?.orgId) {
      const org = organizations?.find((o) => o.id === params?.orgId);
      setCurrentOrganizationState(org);
    } else {
      setCurrentOrganizationState(undefined);
    }
  }, [params, organizations]);

  // Change org and update URL
  const setCurrentOrganization = useCallback(
    (org?: Organization) => {
      setCurrentOrganizationState(org);
      if (org) {
        router.replace(`/orgs/${org.id}`);
      } else {
        router.replace(`/orgs`);
      }
    },
    [router]
  );

  const value = useMemo(
    () => ({
      organizations,
      currentOrganization,
      setCurrentOrganization,
      loading,
    }),
    [organizations, currentOrganization, setCurrentOrganization, loading]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const ctx = useContext(OrganizationContext);
  if (!ctx)
    throw new Error(
      "useOrganizationContext must be used within OrganizationProvider"
    );
  return ctx;
}
