import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import {
  CalendarToday as DateIcon,
} from "@mui/icons-material";
import type { Issue } from "../types/issue";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { useNavigate } from "react-router-dom";

export default function IssueCard({ issue }: { issue: Issue }) {
  const navigate = useNavigate();

  const createdDate = issue.createdAt
    ? new Date(issue.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        onClick={() => navigate(`/issues/${issue._id}`)}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {issue.title}
          </Typography>

          {issue.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {issue.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </Stack>

          {createdDate && (
            <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
              <DateIcon sx={{ fontSize: 14, color: "text.disabled" }} />
              <Typography variant="caption" color="text.disabled">
                {createdDate}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
