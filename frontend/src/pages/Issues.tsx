import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Issue } from "../types/issue";
import IssueCard from "../components/IssueCard";
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  InputAdornment,
  Grid,
  Fade,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  BugReport as BugIcon,
  Autorenew as ProgressIcon,
  CheckCircle as ResolvedIcon,
  Cancel as ClosedIcon,
} from "@mui/icons-material";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { exportCSV } from "../utils/exportCSV";

const STATUS_OPTIONS = ["All", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High"];

type StatusCounts = { Open: number; "In Progress": number; Resolved: number; Closed: number };

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState<StatusCounts>({
    Open: 0,
    "In Progress": 0,
    Resolved: 0,
    Closed: 0,
  });
  const debounced = useDebounce(search);

  useEffect(() => {
    const params: Record<string, string | number> = {
      search: debounced,
      page,
    };
    if (statusFilter !== "All") params.status = statusFilter;
    if (priorityFilter !== "All") params.priority = priorityFilter;

    api.get("/issues", { params }).then((res) => {
      const data = res.data;
      if (Array.isArray(data)) {
        setIssues(data);
      } else {
        setIssues(data.issues || data.data || []);
        if (data.totalPages) setTotalPages(data.totalPages);
        if (data.statusCounts) setCounts(data.statusCounts);
      }
    });
  }, [debounced, page, statusFilter, priorityFilter]);

  const statusCards = [
    {
      label: "Open",
      count: counts.Open,
      color: "#f59e0b",
      bg: "#fffbeb",
      icon: <BugIcon />,
    },
    {
      label: "In Progress",
      count: counts["In Progress"],
      color: "#3b82f6",
      bg: "#eff6ff",
      icon: <ProgressIcon />,
    },
    {
      label: "Resolved",
      count: counts.Resolved,
      color: "#22c55e",
      bg: "#f0fdf4",
      icon: <ResolvedIcon />,
    },
    {
      label: "Closed",
      count: counts.Closed,
      color: "#6b7280",
      bg: "#f9fafb",
      icon: <ClosedIcon />,
    },
  ];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4">Issues</Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage all project issues
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={async () => {
            const res = await api.get("/issues", { params: { limit: 100000 } });
            const all = Array.isArray(res.data) ? res.data : res.data.issues ?? [];
            exportCSV(all);
          }}
        >
          Export CSV
        </Button>
      </Stack>

      {/* Status Count Cards */}
      <Grid container spacing={2}>
        {statusCards.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Card
              sx={{
                bgcolor: s.bg,
                border: `1px solid ${s.color}22`,
                cursor: "pointer",
                "&:hover": { transform: "translateY(-2px)" },
              }}
              onClick={() =>
                setStatusFilter(statusFilter === s.label ? "All" : s.label)
              }
            >
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ color: s.color, fontWeight: 800 }}
                    >
                      {s.count}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: s.color, fontWeight: 600 }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                  <Box sx={{ color: s.color, opacity: 0.6, fontSize: 40 }}>
                    {s.icon}
                  </Box>
                </Stack>
                {statusFilter === s.label && (
                  <Chip
                    label="Filtered"
                    size="small"
                    sx={{ mt: 1, bgcolor: s.color, color: "#fff" }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              placeholder="Search issues..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={{ minWidth: 150 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={{ minWidth: 150 }}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Issue List */}
      {issues.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <BugIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              No issues found. Create your first issue!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {issues.map((issue, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={issue._id}>
              <Fade in timeout={200 + i * 50}>
                <div>
                  <IssueCard issue={issue} />
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </Stack>
  );
}
