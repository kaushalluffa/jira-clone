"use client"

import { Bell, Command, HelpCircle, Plus, Search, Settings, Sparkles } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAppData } from "./app-data-provider"
import { ModeToggle } from "./mode-toggle"

export function TopNav({
  onOpenCreate = () => {},
  onOpenShortcuts = () => {},
  onOpenCommand = () => {},
}: {
  onOpenCreate?: () => void
  onOpenShortcuts?: () => void
  onOpenCommand?: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const { state } = useAppData()
  const unread = state.notifications.filter((n) => !n.read).length

  return (
    <TooltipProvider>
      <div className="h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5" />
            <span className="hidden sm:inline">Jira Mock</span>
          </Link>

          <div className="relative ml-2 hidden md:flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search issues, projects..."
              className="pl-9 w-[28rem]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`)
              }}
              aria-label="Search"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <ModeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={onOpenCommand} aria-label="Command Palette">
                  <Command className="h-4 w-4" />
                  <span className="hidden sm:inline">Command</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open command palette (Ctrl/Cmd + K)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="gap-2" onClick={onOpenCreate} aria-label="Create Issue">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create new issue</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    {unread > 0 ? (
                      <Badge className="absolute -top-2 -right-2 px-1 py-0 h-4 min-w-4 rounded-full text-[10px]" variant="destructive">
                        {unread}
                      </Badge>
                    ) : null}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {state.notifications.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No notifications</div>
                ) : (
                  state.notifications.slice(0, 6).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1">
                      <div className="text-sm">{n.title}</div>
                      {n.body ? <div className="text-xs text-muted-foreground">{n.body}</div> : null}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings" aria-label="Settings" className="inline-flex">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Workspace settings</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="Current user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Profile is a mock screen")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Preferences are mocked")}>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenShortcuts}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Logged out (mock)")}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
