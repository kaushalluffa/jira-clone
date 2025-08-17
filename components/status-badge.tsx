"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Status } from "@/lib/types"

function statusClasses(status: Status) {
  switch (status) {
    case "To Do":
      return "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
    case "In Progress":
      return "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
    case "In Review":
      return "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300"
    case "Done":
      return "border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
    default:
      return "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
  }
}

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <Badge variant="outline" className={cn(statusClasses(status), className)}>
      {status}
    </Badge>
  )
}
