export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  severity?: string;
  createdAt?: string;
}
