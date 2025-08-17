"use client"

import { useEffect, useState } from "react"
import { TopNav } from "./top-nav"
import { LeftSidebar } from "./left-sidebar"
import { CreateIssueDialog } from "./create-issue-dialog"
import { CommandPalette } from "./command-palette"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AppShell({
  children,
  title = "",
}: {
  children?: React.ReactNode
  title?: string
}) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openCmd, setOpenCmd] = useState(false)
  const [openShortcuts, setOpenShortcuts] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpenCmd((v) => !v)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "/") {
        e.preventDefault()
        setOpenShortcuts(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <TopNav onOpenCreate={() => setOpenCreate(true)} onOpenCommand={() => setOpenCmd(true)} onOpenShortcuts={() => setOpenShortcuts(true)} />
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 min-w-0">
          {title ? <div className="px-4 md:px-6 py-4 border-b"><h1 className="text-xl md:text-2xl font-semibold">{title}</h1></div> : null}
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>

      <CreateIssueDialog open={openCreate} onOpenChange={setOpenCreate} />
      <CommandPalette open={openCmd} onOpenChange={setOpenCmd} onOpenCreate={() => setOpenCreate(true)} />

      <Dialog open={openShortcuts} onOpenChange={setOpenShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between"><div>Open Command Palette</div><kbd className="px-2 py-1 rounded bg-muted">Cmd/Ctrl + K</kbd></div>
            <div className="flex items-center justify-between"><div>Open Shortcuts</div><kbd className="px-2 py-1 rounded bg-muted">Cmd/Ctrl + /</kbd></div>
            <div className="flex items-center justify-between"><div>Create Issue</div><kbd className="px-2 py-1 rounded bg-muted">C</kbd></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
