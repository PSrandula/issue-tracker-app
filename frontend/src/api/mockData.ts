import type { Issue } from "../types/issue";

// ── Fake JWT token ──
export const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImRlbW9AdGVzdC5jb20ifQ.mock";

// ── Seed issues ──
let nextId = 11;

export let mockIssues: Issue[] = [
  {
    _id: "1",
    title: "Login page crashes on empty submit",
    description:
      "When a user submits the login form with both fields empty, the app throws an unhandled promise rejection and shows a white screen.",
    status: "Open",
    priority: "High",
    severity: "Critical",
    createdAt: "2026-01-15T08:30:00Z",
  },
  {
    _id: "2",
    title: "Dashboard stats don't refresh after status change",
    description:
      "After marking an issue as Resolved the status count cards on the Issues page still show the old numbers until the page is reloaded manually.",
    status: "In Progress",
    priority: "Medium",
    severity: "Major",
    createdAt: "2026-01-18T10:15:00Z",
  },
  {
    _id: "3",
    title: "CSV export includes internal _id field",
    description:
      "The exported CSV contains the MongoDB _id column which is not useful for end users. Should be removed or replaced with a human-readable ID.",
    status: "Open",
    priority: "Low",
    severity: "Minor",
    createdAt: "2026-01-20T14:00:00Z",
  },
  {
    _id: "4",
    title: "Password reset email not sent",
    description:
      "Users who click 'Forgot Password' never receive the reset email. The SMTP configuration seems incorrect in production.",
    status: "Open",
    priority: "High",
    severity: "Critical",
    createdAt: "2026-01-22T09:45:00Z",
  },
  {
    _id: "5",
    title: "Pagination shows negative page numbers",
    description:
      "If a user rapidly clicks the Previous button, the page state can go below 1, causing an API error.",
    status: "Resolved",
    priority: "Medium",
    severity: "Minor",
    createdAt: "2026-01-25T11:30:00Z",
  },
  {
    _id: "6",
    title: "Mobile layout overflows on Issue Details",
    description:
      "On screens narrower than 375px the action buttons overflow outside the card. Needs responsive wrapping.",
    status: "In Progress",
    priority: "Medium",
    severity: "Major",
    createdAt: "2026-01-28T16:20:00Z",
  },
  {
    _id: "7",
    title: "Add dark mode toggle",
    description:
      "Users have requested a dark mode option. Add a theme toggle in the navbar that persists the preference in localStorage.",
    status: "Open",
    priority: "Low",
    createdAt: "2026-02-01T08:00:00Z",
  },
  {
    _id: "8",
    title: "JWT token not refreshed before expiry",
    description:
      "The access token expires after 1 hour but there is no refresh mechanism. Users get silently logged out and see 401 errors.",
    status: "Open",
    priority: "High",
    severity: "Critical",
    createdAt: "2026-02-03T13:10:00Z",
  },
  {
    _id: "9",
    title: "Search should be case-insensitive",
    description:
      "Searching for 'Login' returns results but 'login' does not. The API query needs a case-insensitive regex or collation.",
    status: "Closed",
    priority: "Low",
    severity: "Minor",
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    _id: "10",
    title: "Implement role-based access control",
    description:
      "Only admins should be able to delete issues. Regular users should only edit their own issues. Add role field to User model and middleware.",
    status: "Open",
    priority: "High",
    severity: "Major",
    createdAt: "2026-02-08T15:45:00Z",
  },
];

// ── Helpers ──

export function findIssue(id: string) {
  return mockIssues.find((i) => i._id === id);
}

export function createIssue(data: Partial<Issue>): Issue {
  const issue: Issue = {
    _id: String(nextId++),
    title: data.title || "Untitled",
    description: data.description || "",
    status: (data.status as Issue["status"]) || "Open",
    priority: (data.priority as Issue["priority"]) || "Medium",
    severity: data.severity,
    createdAt: new Date().toISOString(),
  };
  mockIssues.unshift(issue);
  return issue;
}

export function updateIssue(id: string, data: Partial<Issue>): Issue | null {
  const idx = mockIssues.findIndex((i) => i._id === id);
  if (idx === -1) return null;
  mockIssues[idx] = { ...mockIssues[idx], ...data };
  return mockIssues[idx];
}

export function deleteIssue(id: string): boolean {
  const len = mockIssues.length;
  mockIssues = mockIssues.filter((i) => i._id !== id);
  return mockIssues.length < len;
}

export function queryIssues(params: {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) {
  let filtered = [...mockIssues];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }
  if (params.status && params.status !== "All") {
    filtered = filtered.filter((i) => i.status === params.status);
  }
  if (params.priority && params.priority !== "All") {
    filtered = filtered.filter((i) => i.priority === params.priority);
  }

  // Counts from ALL issues (not filtered / paginated)
  const allIssues = [...mockIssues];
  const statusCounts = {
    Open: allIssues.filter((i) => i.status === "Open").length,
    "In Progress": allIssues.filter((i) => i.status === "In Progress").length,
    Resolved: allIssues.filter((i) => i.status === "Resolved").length,
    Closed: allIssues.filter((i) => i.status === "Closed").length,
  };

  const page = params.page || 1;
  const limit = params.limit || 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const start = (page - 1) * limit;
  const issues = filtered.slice(start, start + limit);

  return { issues, totalPages, total: filtered.length, statusCounts };
}
