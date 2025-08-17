"use client"

import { GripVertical, MessageSquare, MoreHorizontal, Timer } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppData } from "./app-data-provider"
import { useRouter } from "next/navigation"
import type { Issue } from "@/lib/types"

export function IssueCard({
  issue,
  onOpen = () => {},
}: {
  issue: Issue
  onOpen?: () => void
}) {
  const { state } = useAppData()
  const user = issue.assigneeId ? state.users[issue.assigneeId] : undefined
  const router = useRouter()

  return (
    <Card className="p-3 hover:shadow-sm group cursor-pointer">
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/60 mt-1 opacity-0 group-hover:opacity-100" />
        <div className="flex-1 min-w-0" onClick={onOpen} role="button" aria-label={`Open ${issue.key}`}>
          <div className="text-xs text-muted-foreground">{issue.key}</div>
          <div className="font-medium truncate">{issue.title}</div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{issue.type}</Badge>
            <Badge variant="secondary">{issue.priority}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {issue.comments.length}
                </div>
              </TooltipTrigger>
              <TooltipContent>Comments</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.avatarUrl ?? "/placeholder.svg?height=32&width=32&query=assignee"} alt={user?.name ?? "Unassigned"} />
            <AvatarFallback className="text-[10px]">{user?.name?.slice(0, 2).toUpperCase() ?? "UN"}</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" aria-label="Issue actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/issues/${issue.id}`)}>Open in page</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Mock: Copy link")}>Copy link</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Mock: Duplicate issue")}>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Mock: Delete (not persisted)")}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <Timer className="h-3.5 w-3.5" />
        {'Updated '}{new Date(issue.updatedAt).toLocaleDateString()}
      </div>
    </Card>
  )
}
