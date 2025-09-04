"use client";

import { useAppData } from "@/components/app-data-provider";
import CreateOrganizationDialog from "@/components/create-organization-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useOrganizations from "@/hooks/use-organizations";
import { Organization } from "@/lib/types";
import { Building2, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrganizationsPage() {
  const { getOrganizations } = useOrganizations();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "pro":
        return "default";
      case "enterprise":
        return "secondary";
      default:
        return "outline";
    }
  };
  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await getOrganizations();
      setOrganizations(orgs?.organizations);
    };
    fetchOrganizations();
  }, []);
  console.log(organizations);

  return (
    <>
      {organizations?.length ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Organizations</h1>
              <p className="text-muted-foreground">
                Manage your organizations and teams
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search organizations..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {organizations?.map((org) => {
              const owner = org?.owner;
              const memberCount = org?.memberCount || 0;
              const projectCount = org?.projectCount || 0;

              return (
                <Link key={org.id} href={`/orgs/${org.id}`}>
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={org.logo || ""} alt={org.name} />
                            <AvatarFallback>
                              {org.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {org.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={getPlanBadgeVariant("pro")}
                                className="text-xs"
                              >
                                {"pro".charAt(0).toUpperCase() + "pro".slice(1)}
                              </Badge>
                              {/* {org.ownerId === state.currentUserId && (
                                <Badge variant="outline" className="text-xs">
                                  Owner
                                </Badge>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {org.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {org.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {memberCount} member{memberCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>
                            {projectCount} project
                            {projectCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      {owner && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={owner.avatar || ""}
                              alt={owner.name}
                            />
                            <AvatarFallback className="text-xs">
                              {owner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            Owned by {owner.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {organizations?.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No organizations found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">No organizations yet</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Organizations help you manage teams and projects. Create your
              first organization to get started.
            </p>

            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </div>
        </div>
      )}
      <CreateOrganizationDialog open={isCreateOpen} setOpen={setIsCreateOpen} />
    </>
  );
}
