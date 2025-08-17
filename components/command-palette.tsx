"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

export function CommandPalette({
  open = false,
  onOpenChange = () => {},
  onOpenCreate = () => {},
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  onOpenCreate?: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        onOpenCreate()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onOpenCreate])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => router.push("/")}>Go to Dashboard</CommandItem>
          <CommandItem onSelect={() => router.push("/projects")}>Go to Projects</CommandItem>
          <CommandItem onSelect={() => router.push("/people")}>Go to People</CommandItem>
          <CommandItem onSelect={() => router.push("/search")}>Search</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => onOpenCreate()}>Create Issue</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
