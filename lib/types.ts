export type ID = string;

export type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";
export type IssueType = "Task" | "Bug" | "Story" | "Epic";

export type LinkType =
  | "blocks"
  | "is blocked by"
  | "relates to"
  | "duplicates"
  | "is duplicated by";

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Organization {
  id:           string;
  name:         string;
  slug:         string;
  description:  null;
  logo:         null;
  owner:        Owner;
  members:      Member[];
  memberCount:  number;
  projectCount: number;
  settings:     Settings;
  createdAt:    Date;
  updatedAt:    Date;
}

export interface Member {
  id:       string;
  role:     string;
  joinedAt: Date;
  user:     Owner;
}

export interface Owner {
  id:     string;
  name:   string;
  email:  string;
  avatar: null;
}

export interface Settings {
}


export interface Project {
  id: ID;
  key: string;
  name: string;
  description?: string;
  leadId: ID;
  organizationId: ID;
  color?: string;
  starred?: boolean;
  members: ID[];
  statuses: Status[];
}

export interface Comment {
  id: ID;
  authorId: ID;
  body: string;
  createdAt: string;
}

export interface IssueLink {
  id: ID;
  targetIssueId: ID;
  type: LinkType;
  note?: string;
}

export interface Issue {
  id: ID;
  key: string;
  projectId: ID;
  type: IssueType;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assigneeId?: ID;
  reporterId: ID;
  tags: string[];
  estimate?: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  links: IssueLink[];
}

export interface Sprint {
  id: ID;
  projectId: ID;
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  issueIds: ID[];
  active?: boolean;
}

export interface AppState {
  users: Record<ID, User>;
  organizations: Record<ID, Organization>;
  projects: Record<ID, Project>;
  issues: Record<ID, Issue>;
  sprints: Record<ID, Sprint>;
  boardOrder: Record<ID, Record<Status, ID[]>>; // projectId -> status -> issueIds order
  recentIssueIds: ID[];
  notifications: {
    id: ID;
    title: string;
    body?: string;
    read?: boolean;
    createdAt: string;
  }[];
  currentUserId: ID;
}
