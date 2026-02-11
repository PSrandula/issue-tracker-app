import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  BugReport as BugIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuthStore } from "../store/auth.store";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 36,
                height: 36,
              }}
            >
              <BugIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              IssueTracker
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {token && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                onClick={() => navigate("/create")}
              >
                New Issue
              </Button>
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} color="error">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
