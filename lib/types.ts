export type ID = string

export type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest"
export type Status = "To Do" | "In Progress" | "In Review" | "Done"
export type IssueType = "Task" | "Bug" | "Story" | "Epic"

export type LinkType = "blocks" | "is blocked by" | "relates to" | "duplicates" | "is duplicated by"

export interface User {
  id: ID
  name: string
  email: string
  avatarUrl?: string
}

export interface Project {
  id: ID
  key: string
  name: string
  description?: string
  leadId: ID
  color?: string
  starred?: boolean
  members: ID[]
  statuses: Status[]
}

export interface Comment {
  id: ID
  authorId: ID
  body: string
  createdAt: string
}

export interface IssueLink {
  id: ID
  targetIssueId: ID
  type: LinkType
  note?: string
}

export interface Issue {
  id: ID
  key: string
  projectId: ID
  type: IssueType
  title: string
  description?: string
  status: Status
  priority: Priority
  assigneeId?: ID
  reporterId: ID
  tags: string[]
  estimate?: number
  createdAt: string
  updatedAt: string
  comments: Comment[]
  links: IssueLink[]
}

export interface Sprint {
  id: ID
  projectId: ID
  name: string
  goal?: string
  startDate?: string
  endDate?: string
  issueIds: ID[]
  active?: boolean
}

export interface AppState {
  users: Record<ID, User>
  projects: Record<ID, Project>
  issues: Record<ID, Issue>
  sprints: Record<ID, Sprint>
  boardOrder: Record<ID, Record<Status, ID[]>> // projectId -> status -> issueIds order
  recentIssueIds: ID[]
  notifications: { id: ID; title: string; body?: string; read?: boolean; createdAt: string }[]
}
