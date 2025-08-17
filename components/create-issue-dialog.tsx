"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppData } from "./app-data-provider"
import type { IssueType, Priority, Status } from "@/lib/types"

export function CreateIssueDialog({
  open = false,
  onOpenChange = () => {},
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const projectIdFromPath = useMemo(() => {
    const m = pathname?.match(/\/projects\/([^\/]+)/)
    return m?.[1] ?? "p_web"
  }, [pathname])

  const { state, createIssue } = useAppData()
  const [title, setTitle] = useState("")
  const [projectId, setProjectId] = useState(projectIdFromPath)
  const [type, setType] = useState<IssueType>("Task")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [status, setStatus] = useState<Status>("To Do")
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState("")

  const projects = Object.values(state.projects)
  const users = Object.values(state.users)

  function reset() {
    setTitle("")
    setType("Task")
    setPriority("Medium")
    setStatus("To Do")
    setAssigneeId(undefined)
    setDescription("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>Create a new issue with mock data. No backend required.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write a clear, concise title" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as IssueType)}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {["Task", "Bug", "Story", "Epic"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {state.projects[projectId]?.statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  {["Highest", "High", "Medium", "Low", "Lowest"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Assignee</Label>
              <Select value={assigneeId ?? "unassigned"} onValueChange={(v) => setAssigneeId(v === "unassigned" ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Assignee" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details..." rows={5} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!title.trim()) return
              const issue = createIssue({
                title,
                description,
                priority,
                type,
                status,
                assigneeId,
                reporterId: Object.values(state.users)[0]?.id ?? "u_alex",
                projectId,
                tags: [],
                estimate: undefined,
              })
              onOpenChange(false)
              // Navigate to project board where it's most visible
              router.push(`/projects/${projectId}/board?created=${issue.key}`)
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
