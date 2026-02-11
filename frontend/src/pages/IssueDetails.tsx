import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Issue } from "../types/issue";
import {
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ResolvedIcon,
  DoNotDisturb as ClosedIcon,
  CalendarToday as DateIcon,
} from "@mui/icons-material";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ConfirmDialog from "../components/ConfirmDialog";

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    action: () => void;
  }>({ title: "", action: () => {} });

  useEffect(() => {
    api.get(`/issues/${id}`).then((res) => setIssue(res.data));
  }, [id]);

  const refreshIssue = () => {
    api.get(`/issues/${id}`).then((res) => setIssue(res.data));
  };

  const handleStatusChange = (status: string) => {
    setConfirmAction({
        title: `Mark this issue as "${status}"?`,
      action: async () => {
        await api.patch(`/issues/${id}`, { status });
        refreshIssue();
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    setConfirmAction({
      title: "Delete this issue permanently?",
      action: async () => {
        await api.delete(`/issues/${id}`);
        navigate("/");
      },
    });
    setConfirmOpen(true);
  };

  if (!issue) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  const createdDate = issue.createdAt
    ? new Date(issue.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Stack spacing={3}>
      {/* Top Bar */}
      <Stack direction="row" alignItems="center" gap={2}>
        <Tooltip title="Back to Issues">
          <IconButton onClick={() => navigate("/")}>
            <BackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Issue Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/edit/${id}`)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>

      {/* Main Card */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {issue.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                {issue.severity && (
                  <Chip label={issue.severity} size="small" variant="outlined" />
                )}
                {createdDate && (
                  <Chip
                    icon={<DateIcon />}
                    label={createdDate}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 2,
                  minHeight: 80,
                }}
              >
                {issue.description || "No description provided."}
              </Typography>
            </Box>

            <Divider />

            {/* Details Grid */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {issue.status}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {issue.priority}
                </Typography>
              </Grid>
              {issue.severity && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Severity
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {issue.severity}
                  </Typography>
                </Grid>
              )}
              {createdDate && (
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {createdDate}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Divider />

            {/* Actions */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {issue.status !== "Resolved" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ResolvedIcon />}
                  onClick={() => handleStatusChange("Resolved")}
                >
                  Mark Resolved
                </Button>
              )}
              {issue.status !== "Closed" && (
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<ClosedIcon />}
                  onClick={() => handleStatusChange("Closed")}
                  sx={{ bgcolor: "grey.600", color: "#fff", "&:hover": { bgcolor: "grey.700" } }}
                >
                  Close Issue
                </Button>
              )}
              {(issue.status === "Resolved" || issue.status === "Closed") && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleStatusChange("Open")}
                >
                  Reopen
                </Button>
              )}
              <Button
                variant="outlined"
                color="info"
                onClick={() => handleStatusChange("In Progress")}
                disabled={issue.status === "In Progress"}
              >
                Mark In Progress
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmAction.title}
        onConfirm={confirmAction.action}
        onClose={() => setConfirmOpen(false)}
      />
    </Stack>
  );
}
