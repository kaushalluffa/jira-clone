"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react"
import { mockState } from "@/lib/mock-data"
import type { AppState, ID, Issue, Project, Status } from "@/lib/types"

type Action =
  | { type: "CREATE_ISSUE"; payload: Issue }
  | { type: "UPDATE_ISSUE"; payload: Partial<Issue> & { id: ID } }
  | { type: "MOVE_ISSUE"; payload: { projectId: ID; issueId: ID; toStatus: Status; toIndex?: number } }
  | { type: "STAR_PROJECT"; payload: { projectId: ID; starred: boolean } }
  | { type: "ADD_NOTIFICATION"; payload: { id: ID; title: string; body?: string; createdAt: string } }
  | { type: "MARK_NOTIF_READ"; payload: { id: ID; read: boolean } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CREATE_ISSUE": {
      const issue = action.payload
      const issues = { ...state.issues, [issue.id]: issue }
      const boardOrder = { ...state.boardOrder }
      const order = boardOrder[issue.projectId][issue.status]
      boardOrder[issue.projectId] = { ...boardOrder[issue.projectId], [issue.status]: [issue.id, ...order] }
      const recentIssueIds = [issue.id, ...state.recentIssueIds].slice(0, 20)
      return { ...state, issues, boardOrder, recentIssueIds }
    }
    case "UPDATE_ISSUE": {
      const cur = state.issues[action.payload.id]
      if (!cur) return state
      const updated: Issue = { ...cur, ...action.payload, updatedAt: new Date().toISOString() }
      return { ...state, issues: { ...state.issues, [updated.id]: updated } }
    }
    case "MOVE_ISSUE": {
      const { issueId, projectId, toStatus, toIndex } = action.payload
      const board = { ...state.boardOrder[projectId] }
      const prevStatus = Object.keys(board).find((s) => board[s as Status].includes(issueId)) as Status | undefined
      if (!prevStatus) return state
      const prevList = board[prevStatus].filter((id) => id !== issueId)
      const nextList = [...board[toStatus]]
      const idx = toIndex ?? nextList.length
      nextList.splice(idx, 0, issueId)

      const issues = { ...state.issues }
      issues[issueId] = { ...issues[issueId], status: toStatus, updatedAt: new Date().toISOString() }

      return {
        ...state,
        issues,
        boardOrder: { ...state.boardOrder, [projectId]: { ...board, [prevStatus]: prevList, [toStatus]: nextList } },
      }
    }
    case "STAR_PROJECT": {
      const { projectId, starred } = action.payload
      const project = state.projects[projectId]
      if (!project) return state
      return { ...state, projects: { ...state.projects, [projectId]: { ...project, starred } } }
    }
    case "ADD_NOTIFICATION": {
      return { ...state, notifications: [action.payload, ...state.notifications] }
    }
    case "MARK_NOTIF_READ": {
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload.id ? { ...n, read: action.payload.read } : n)),
      }
    }
    default:
      return state
  }
}

type Ctx = {
  state: AppState
  dispatch: React.Dispatch<Action>
  createIssue: (input: Omit<Issue, "id" | "key" | "createdAt" | "updatedAt">) => Issue
  updateIssue: (patch: Partial<Issue> & { id: ID }) => void
  moveIssue: (projectId: ID, issueId: ID, toStatus: Status, toIndex?: number) => void
  starProject: (projectId: ID, starred: boolean) => void
}

const AppDataContext = createContext<Ctx | undefined>(undefined)
const STORAGE_KEY = "jira-mock-state"

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return mockState
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.projects || !parsed.issues) return mockState
    return parsed
  } catch {
    return mockState
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function randomKey(prefix: string, n = 4) {
  const s = Math.random().toString(36).slice(2, 2 + n).toUpperCase()
  return `${prefix}-${s}`
}

export function AppDataProvider({ children }: { children?: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as AppState, () => {
    if (typeof window === "undefined") return mockState
    return loadState()
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const createIssue = useCallback<Ctx["createIssue"]>(
    (input) => {
      const id = `${input.projectId}_${Date.now()}`
      const project = state.projects[input.projectId]
      const key = randomKey(project?.key ?? "ISSUE")
      const now = new Date().toISOString()
      const issue: Issue = {
        id,
        key,
        createdAt: now,
        updatedAt: now,
        comments: [],
        links: [],
        ...input,
      }
      dispatch({ type: "CREATE_ISSUE", payload: issue })
      return issue
    },
    [state.projects],
  )

  const updateIssue = useCallback<Ctx["updateIssue"]>((patch) => dispatch({ type: "UPDATE_ISSUE", payload: patch }), [])
  const moveIssue = useCallback<Ctx["moveIssue"]>(
    (projectId, issueId, toStatus, toIndex) => dispatch({ type: "MOVE_ISSUE", payload: { projectId, issueId, toStatus, toIndex } }),
    [],
  )
  const starProject = useCallback<Ctx["starProject"]>(
    (projectId, starred) => dispatch({ type: "STAR_PROJECT", payload: { projectId, starred } }),
    [],
  )

  const value = useMemo<Ctx>(() => ({ state, dispatch, createIssue, updateIssue, moveIssue, starProject }), [state, createIssue, updateIssue, moveIssue, starProject])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider")
  return ctx
}
