"use client"

import { Filter, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type FilterState = {
  statuses: string[]
  priorities: string[]
}

export function FiltersBar({
  value = { statuses: [], priorities: [] },
  onChange = () => {},
}: {
  value?: FilterState
  onChange?: (v: FilterState) => void
}) {
  const statuses: string[] = ["To Do", "In Progress", "In Review", "Done"]
  const priorities: string[] = ["Highest", "High", "Medium", "Low", "Lowest"]

  function toggle(list: string[], item: string) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {statuses.map((s) => (
            <DropdownMenuCheckboxItem
              key={s}
              checked={value.statuses.includes(s)}
              onCheckedChange={() => onChange({ ...value, statuses: toggle(value.statuses, s) })}
            >
              {s}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {priorities.map((p) => (
            <DropdownMenuCheckboxItem
              key={p}
              checked={value.priorities.includes(p)}
              onCheckedChange={() => onChange({ ...value, priorities: toggle(value.priorities, p) })}
            >
              {p}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {value.statuses.map((s) => (
        <Badge key={s} variant="secondary" className="flex items-center gap-1">
          {s}
          <button onClick={() => onChange({ ...value, statuses: value.statuses.filter((x) => x !== s) })} aria-label={`Remove filter ${s}`}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {value.priorities.map((p) => (
        <Badge key={p} variant="secondary" className="flex items-center gap-1">
          {p}
          <button onClick={() => onChange({ ...value, priorities: value.priorities.filter((x) => x !== p) })} aria-label={`Remove filter ${p}`}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
