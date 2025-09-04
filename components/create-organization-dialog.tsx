import { Input } from "@/components/ui/input";
import useOrganizations from "@/hooks/use-organizations";
import { CircleQuestionMark } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "next/navigation";

export default function CreateOrganizationDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { createOrganization } = useOrganizations();
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [newOrgPlan, setNewOrgPlan] = useState<"free" | "pro" | "enterprise">(
    "free"
  );
  const router = useRouter();
  const handleCreateOrg = async () => {
    if (!newOrgName.trim()) return;

    const createOrgResp = await createOrganization({
      name: newOrgName,
      description: newOrgDescription || undefined,
    });

    setNewOrgName("");
    setNewOrgDescription("");
    setNewOrgPlan("free");
    if (createOrgResp) {
      router.push(`/orgs/${createOrgResp.id}`);
    }
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Set up a new organization to manage your team and projects.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-description">Description (optional)</Label>
            <Textarea
              id="org-description"
              value={newOrgDescription}
              onChange={(e) => setNewOrgDescription(e.target.value)}
              placeholder="What does your organization do?"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-plan">
              Plan
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  Currently only Free plan is available.
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select value={newOrgPlan} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrg} disabled={!newOrgName.trim()}>
            Create Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
