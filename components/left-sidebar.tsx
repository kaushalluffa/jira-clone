"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Blocks, Home, KanbanIcon as LayoutKanban, Library, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projects", icon: Blocks },
  { href: "/people", label: "People", icon: Users },
  { href: "/search", label: "Search", icon: Library },
]

export function LeftSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname()
  return (
    <aside className={cn("hidden md:flex md:w-64 border-r bg-muted/20", className)}>
      <nav className="p-2 w-full">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon || LayoutKanban
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", active && "font-semibold")}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
