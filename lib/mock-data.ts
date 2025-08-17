import type { AppState, ID, Issue, Project, Sprint, User } from "./types"

const now = () => new Date().toISOString()

const users: User[] = [
  {
    id: "u_alex",
    name: "Alex Kim",
    email: "alex@example.com",
    avatarUrl: "/avatar-alex.png",
  },
  {
    id: "u_jordan",
    name: "Jordan Lee",
    email: "jordan@example.com",
    avatarUrl: "/stylized-basketball-avatar.png",
  },
  {
    id: "u_sam",
    name: "Sam Patel",
    email: "sam@example.com",
    avatarUrl: "/avatar-sam.png",
  },
]

const projects: Project[] = [
  {
    id: "p_web",
    key: "WEB",
    name: "Website Revamp",
    description: "Marketing site redesign and migration.",
    leadId: "u_alex",
    color: "#7C3AED",
    members: ["u_alex", "u_jordan", "u_sam"],
    statuses: ["To Do", "In Progress", "In Review", "Done"],
    starred: true,
  },
  {
    id: "p_app",
    key: "APP",
    name: "Mobile App",
    description: "New iOS/Android mobile app.",
    leadId: "u_jordan",
    color: "#059669",
    members: ["u_alex", "u_jordan"],
    statuses: ["To Do", "In Progress", "In Review", "Done"],
  },
]

const issues: Issue[] = [
  {
    id: "i_web_1",
    key: "WEB-1",
    projectId: "p_web",
    type: "Story",
    title: "Build new landing page hero",
    description: "Implement hero section with responsive images and CTA.",
    status: "To Do",
    priority: "High",
    assigneeId: "u_alex",
    reporterId: "u_jordan",
    tags: ["frontend", "marketing"],
    estimate: 3,
    createdAt: now(),
    updatedAt: now(),
    comments: [],
    links: [
      {
        id: "l_web1_from_web2",
        targetIssueId: "i_web_2",
        type: "is blocked by",
        note: "Waiting for performance fix",
      },
    ],
  },
  {
    id: "i_web_2",
    key: "WEB-2",
    projectId: "p_web",
    type: "Bug",
    title: "Fix lighthouse performance drop",
    description: "Investigate CLS jump on first paint.",
    status: "In Progress",
    priority: "Medium",
    assigneeId: "u_sam",
    reporterId: "u_alex",
    tags: ["perf"],
    estimate: 5,
    createdAt: now(),
    updatedAt: now(),
    comments: [],
    links: [
      {
        id: "l_web2_to_web1",
        targetIssueId: "i_web_1",
        type: "blocks",
        note: "Perf regression blocks hero launch",
      },
      {
        id: "l_web2_rel_app1",
        targetIssueId: "i_app_1",
        type: "relates to",
        note: "Similar metrics in app",
      },
    ],
  },
  {
    id: "i_web_3",
    key: "WEB-3",
    projectId: "p_web",
    type: "Task",
    title: "Add analytics events",
    description: "Track CTA clicks and form submissions.",
    status: "In Review",
    priority: "Low",
    assigneeId: "u_jordan",
    reporterId: "u_alex",
    tags: ["analytics"],
    estimate: 2,
    createdAt: now(),
    updatedAt: now(),
    comments: [],
    links: [],
  },
  {
    id: "i_web_4",
    key: "WEB-4",
    projectId: "p_web",
    type: "Bug",
    title: "404 page broken on nested routes",
    description: "Ensure dynamic route fallback works.",
    status: "Done",
    priority: "High",
    assigneeId: "u_alex",
    reporterId: "u_alex",
    tags: ["routing"],
    estimate: 1,
    createdAt: now(),
    updatedAt: now(),
    comments: [],
    links: [],
  },
  {
    id: "i_app_1",
    key: "APP-1",
    projectId: "p_app",
    type: "Story",
    title: "Implement login with email code",
    description: "Magic link and one-time code login flow.",
    status: "To Do",
    priority: "Highest",
    assigneeId: "u_jordan",
    reporterId: "u_jordan",
    tags: ["auth"],
    estimate: 8,
    createdAt: now(),
    updatedAt: now(),
    comments: [],
    links: [
      {
        id: "l_app1_rel_web2",
        targetIssueId: "i_web_2",
        type: "relates to",
        note: "Cross-platform perf considerations",
      },
    ],
  },
]

const sprints: Sprint[] = [
  {
    id: "s_web_1",
    projectId: "p_web",
    name: "Sprint 1",
    goal: "Ship MVP hero and fix critical bugs",
    startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    issueIds: ["i_web_1", "i_web_2", "i_web_3"],
    active: true,
  },
  {
    id: "s_web_2",
    projectId: "p_web",
    name: "Sprint 2",
    goal: "Analytics & SEO",
    startDate: undefined,
    endDate: undefined,
    issueIds: [],
    active: false,
  },
]

function toRecord<T extends { id: ID }>(arr: T[]) {
  return Object.fromEntries(arr.map((x) => [x.id, x])) as Record<ID, T>
}

function buildBoardOrder(): AppState["boardOrder"] {
  const map: AppState["boardOrder"] = {}
  for (const p of projects) {
    map[p.id] = { "To Do": [], "In Progress": [], "In Review": [], "Done": [] }
  }
  for (const issue of issues) {
    map[issue.projectId][issue.status].push(issue.id)
  }
  return map
}

export const mockState: AppState = {
  users: toRecord(users),
  projects: toRecord(projects),
  issues: toRecord(issues),
  sprints: toRecord(sprints),
  boardOrder: buildBoardOrder(),
  recentIssueIds: ["i_web_2", "i_web_3", "i_web_4"],
  notifications: [
    { id: "n1", title: "Alex mentioned you on WEB-2", body: "Can you check the CLS?", createdAt: now() },
    { id: "n2", title: "Sprint 1 ends in 7 days", createdAt: now() },
  ],
}
