import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { ArrowBack as BackIcon, Save as SaveIcon } from "@mui/icons-material";
import api from "../api/axios";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

export default function CreateEditIssue() {
  const navigate = useNavigate();
  const { id } = useParams(); // if present → edit mode
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing issue for edit mode
  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get(`/issues/${id}`)
      .then((res) => {
        const issue = res.data;
        setTitle(issue.title || "");
        setDescription(issue.description || "");
        setPriority(issue.priority || "Medium");
        setStatus(issue.status || "Open");
        setSeverity(issue.severity || "");
      })
      .catch(() => setError("Failed to load issue"))
      .finally(() => setFetching(false));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        severity: severity.trim() || undefined,
      };

      if (isEdit) {
        await api.put(`/issues/${id}`, data);
        setSuccess("Issue updated successfully!");
        setTimeout(() => navigate(`/issues/${id}`), 800);
      } else {
        await api.post("/issues", data);
        setSuccess("Issue created successfully!");
        setTimeout(() => navigate("/"), 800);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" alignItems="center" gap={2}>
        <Tooltip title="Go Back">
          <IconButton onClick={() => navigate(-1)}>
            <BackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5">
          {isEdit ? "Edit Issue" : "Create New Issue"}
        </Typography>
      </Stack>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={submit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="Brief summary of the issue"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={5}
                fullWidth
                placeholder="Detailed description of the issue..."
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  fullWidth
                >
                  {PRIORITIES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
                {isEdit && (
                  <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  label="Severity (optional)"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  fullWidth
                  placeholder="e.g. Critical, Major, Minor"
                />
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={18} /> : <SaveIcon />
                  }
                  disabled={loading}
                  size="large"
                >
                  {isEdit ? "Update Issue" : "Create Issue"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}
