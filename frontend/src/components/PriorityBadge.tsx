import { Chip } from "@mui/material";
import {
  KeyboardDoubleArrowUp as HighIcon,
  DragHandle as MediumIcon,
  KeyboardDoubleArrowDown as LowIcon,
} from "@mui/icons-material";

const config: Record<string, { color: "error" | "warning" | "default"; icon: React.ReactElement }> = {
  High: { color: "error", icon: <HighIcon sx={{ fontSize: 16 }} /> },
  Medium: { color: "warning", icon: <MediumIcon sx={{ fontSize: 16 }} /> },
  Low: { color: "default", icon: <LowIcon sx={{ fontSize: 16 }} /> },
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const c = config[priority] || { color: "default" as const, icon: undefined };
  return (
    <Chip
      label={priority}
      color={c.color}
      icon={c.icon}
      size="small"
      variant="outlined"
    />
  );
}
