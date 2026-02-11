import { Chip } from "@mui/material";
import {
  BugReport as OpenIcon,
  Autorenew as ProgressIcon,
  CheckCircle as ResolvedIcon,
  Cancel as ClosedIcon,
} from "@mui/icons-material";

const config: Record<string, { color: "warning" | "info" | "success" | "default"; icon: React.ReactElement }> = {
  Open: { color: "warning", icon: <OpenIcon sx={{ fontSize: 16 }} /> },
  "In Progress": { color: "info", icon: <ProgressIcon sx={{ fontSize: 16 }} /> },
  Resolved: { color: "success", icon: <ResolvedIcon sx={{ fontSize: 16 }} /> },
  Closed: { color: "default", icon: <ClosedIcon sx={{ fontSize: 16 }} /> },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = config[status] || { color: "default" as const, icon: undefined };
  return <Chip label={status} color={c.color} icon={c.icon} size="small" />;
}
