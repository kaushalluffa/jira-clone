"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { X, Link2Off, Plus } from 'lucide-react'
import type { ID, Issue, LinkType, Priority, Status } from "@/lib/types"
import { useAppData } from "./app-data-provider"
import { StatusBadge } from "./status-badge"

function linkTypeBadgeClass(type: LinkType) {
  switch (type) {
    case "blocks":
      return "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    case "is blocked by":
      return "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
    case "duplicates":
      return "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300"
    case "is duplicated by":
      return "border-pink-200 bg-pink-100 text-pink-800 dark:border-pink-900 dark:bg-pink-950 dark:text-pink-300"
    default: // "relates to"
      return "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
    }
  }

function invertLinkType(t: LinkType): LinkType {
  switch (t) {
    case "blocks":
      return "is blocked by"
    case "is blocked by":
      return "blocks"
    case "duplicates":
      return "is duplicated by"
    case "is duplicated by":
      return "duplicates"
    default:
      return "relates to"
  }
}

export function IssueDrawer({
  open = false,
  onOpenChange = () => {},
  issueId = "",
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  issueId?: ID
}) {
  const { state, updateIssue, moveIssue } = useAppData()
  const issue = useMemo(() => (issueId ? state.issues[issueId] : undefined), [issueId, state.issues])
  const project = issue ? state.projects[issue.projectId] : undefined
  const users = Object.values(state.users)
  const [desc, setDesc] = useState(issue?.description ?? "")

  // Add link form state
  const [linkTarget, setLinkTarget] = useState("")
  const [linkType, setLinkType] = useState<LinkType>("relates to")
  const [linkNote, setLinkNote] = useState("")

  if (!issue || !project) return null

  function resolveIssueRef(ref: string): Issue | undefined {
    const byId = state.issues[ref]
    if (byId) return byId
    return Object.values(state.issues).find((i) => i.key.toLowerCase() === ref.toLowerCase())
  }

  function addLink() {
    const ref = linkTarget.trim()
    if (!ref) return
    const target = resolveIssueRef(ref)
    if (!target) {
      alert("Issue not found. Enter a valid ID (e.g., i_web_2) or key (e.g., WEB-2).")
      return
    }
    if (target.id === issue.id) {
      alert("Cannot link an issue to itself.")
      return
    }
    const exists = (issue.links ?? []).some((l) => l.targetIssueId === target.id && l.type === linkType)
    if (exists) {
      alert("This link already exists.")
      return
    }
    const linkId = `l_${Date.now()}`
    const newLink = { id: linkId, targetIssueId: target.id, type: linkType, note: linkNote || undefined }
    const reciprocal = { id: `${linkId}_r`, targetIssueId: issue.id, type: invertLinkType(linkType), note: linkNote || undefined }
    updateIssue({ id: issue.id, links: [...(issue.links ?? []), newLink] })
    updateIssue({ id: target.id, links: [...(target.links ?? []), reciprocal] })
    setLinkTarget("")
    setLinkNote("")
    setLinkType("relates to")
  }

  function removeLink(linkId: ID, targetIssueId: ID, type: LinkType) {
    // Remove from current issue
    const pruned = (issue.links ?? []).filter((l) => l.id !== linkId)
    updateIssue({ id: issue.id, links: pruned })

    // Remove reciprocal on target (by target=issue.id and inverted type)
    const target = state.issues[targetIssueId]
    if (target) {
      const inverted = invertLinkType(type)
      const targetPruned = (target.links ?? []).filter((l) => !(l.targetIssueId === issue.id && l.type === inverted))
      updateIssue({ id: target.id, links: targetPruned })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge variant="outline">{issue.key}</Badge>
            <span className="truncate">{issue.title}</span>
          </SheetTitle>
          <SheetDescription>Edit the issue details. Changes are stored locally.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select
                value={issue.status}
                onValueChange={(v) => moveIssue(issue.projectId, issue.id, v as Status)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {project.statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select
                value={issue.priority}
                onValueChange={(v) => updateIssue({ id: issue.id, priority: v as Priority })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Highest", "High", "Medium", "Low", "Lowest"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Assignee</Label>
              <Select
                value={issue.assigneeId ?? "unassigned"}
                onValueChange={(v) => updateIssue({ id: issue.id, assigneeId: v === "unassigned" ? undefined : v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={6}
              placeholder="Describe the issue..."
              onBlur={() => updateIssue({ id: issue.id, description: desc })}
            />
          </div>

          <Separator />
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="links">Linked</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="text-sm text-muted-foreground">
              No recent activity. Leave a comment to start a thread.
            </TabsContent>

            <TabsContent value="people">
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.assigneeId ? state.users[issue.assigneeId]?.avatarUrl : undefined} alt="Assignee" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">Assignee: {issue.assigneeId ? state.users[issue.assigneeId]?.name : "Unassigned"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={state.users[issue.reporterId]?.avatarUrl || "/placeholder.svg"} alt="Reporter" />
                    <AvatarFallback>RP</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">Reporter: {state.users[issue.reporterId]?.name}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links">
              <div className="grid gap-3">
                {(issue.links ?? []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No linked issues.</div>
                ) : (
                  (issue.links ?? []).map((l) => {
                    const t = state.issues[l.targetIssueId]
                    if (!t) {
                      return (
                        <div key={l.id} className="flex items-center justify-between text-sm">
                          <div>
                            <Badge variant="outline" className={"mr-2 " + linkTypeBadgeClass(l.type)}>{l.type}</Badge>
                            <span className="text-muted-foreground">Unknown issue</span>
                            {l.note ? <div className="text-xs text-muted-foreground">{l.note}</div> : null}
                          </div>
                          <Button variant="ghost" size="icon" aria-label="Remove link" onClick={() => removeLink(l.id, l.targetIssueId, l.type)}>
                            <Link2Off className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    }
                    return (
                      <div key={l.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge variant="outline" className={linkTypeBadgeClass(l.type)}>{l.type}</Badge>
                            <Link href={`/issues/${t.id}`} className="font-medium hover:underline truncate">
                              {t.key}: {t.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <StatusBadge status={t.status} />
                            {l.note ? <span className="truncate">· {l.note}</span> : null}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" aria-label="Remove link" onClick={() => removeLink(l.id, t.id, l.type)}>
                          <Link2Off className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>

              <Separator className="my-3" />

              <div className="grid gap-2">
                <div className="text-sm font-medium">Add link</div>
                <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
                  <div className="grid gap-1.5">
                    <Label htmlFor="link-target" className="text-xs">Issue key or ID</Label>
                    <Input
                      id="link-target"
                      placeholder="e.g. WEB-2 or i_web_2"
                      value={linkTarget}
                      onChange={(e) => setLinkTarget(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Relation</Label>
                    <Select value={linkType} onValueChange={(v) => setLinkType(v as LinkType)}>
                      <SelectTrigger><SelectValue placeholder="Relation" /></SelectTrigger>
                      <SelectContent>
                        {["blocks","is blocked by","relates to","duplicates","is duplicated by"].map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="link-note" className="text-xs">Note (optional)</Label>
                  <Input
                    id="link-note"
                    placeholder="Why are these linked?"
                    value={linkNote}
                    onChange={(e) => setLinkNote(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={addLink} disabled={!linkTarget.trim()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add link
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="text-sm text-muted-foreground">
              No attachments. Drag files here (mock only).
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
