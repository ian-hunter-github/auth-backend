import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { LoginModal } from "../components/LoginModal";
import { usePanelApis } from "../hooks/useApi";
import type { ApiError } from "../api/apiClient";
import type { AuthUserProfile } from "../types/authTypes";
import { AdminUsersTable } from "../features/adminUsers/AdminUsersTable";
import { AdminUserFormModal } from "../features/adminUsers/AdminUserFormModal";
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from "../types/adminUsersTypes";
import { useDebug } from "../debug/DebugContext";
import { DebugLogViewer } from "../components/DebugLogViewer";
import { getFunctionsBaseUrl } from "../config";

export function AdminPanel() {
  const auth = useAuth();
  const dbg = useDebug();
  const { adminApi } = usePanelApis();

  const [loginOpen, setLoginOpen] = useState(false);
  const [users, setUsers] = useState<AuthUserProfile[]>([]);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AuthUserProfile | undefined>(undefined);
  const [formError, setFormError] = useState<ApiError | undefined>(undefined);

  const isAdmin = useMemo(() => (auth.user?.roles || []).includes("admin"), [auth.user?.roles]);

  async function loadUsers() {
    setPanelError(undefined);
    try {
      const res = await adminApi.listUsers();
      setUsers(res.users || []);
    } catch (err) {
      setPanelError(err as ApiError);
      setUsers([]);
    }
  }

  useEffect(() => {
    if (auth.isLoggedIn) void loadUsers();
    if (!auth.isLoggedIn) setUsers([]);
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function doCreate(req: AdminCreateUserRequest) {
    setFormError(undefined);
    try {
      await adminApi.createUser(req);
      setCreateOpen(false);
      await loadUsers();
    } catch (err) {
      setFormError(err as ApiError);
      throw err;
    }
  }

  async function doUpdate(req: AdminUpdateUserRequest) {
    if (!editUser) return;
    setFormError(undefined);
    try {
      await adminApi.updateUser(editUser.id, req);
      setEditUser(undefined);
      await loadUsers();
    } catch (err) {
      setFormError(err as ApiError);
      throw err;
    }
  }

  async function doDelete(u: AuthUserProfile) {
    const ok = window.confirm(`Delete user?\n\n${u.username}\n${u.id}`);
    if (!ok) return;

    setPanelError(undefined);
    try {
      await adminApi.deleteUser(u.id);
      await loadUsers();
    } catch (err) {
      setPanelError(err as ApiError);
    }
  }

  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 1.5 }}
    >
      <Box>
        <Typography variant="h6">Admin Panel</Typography>
        <Typography variant="body2" color="text.secondary">
          Independent session: <code>auth.admin.*</code>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Functions base: <code>{getFunctionsBaseUrl()}</code>
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        {auth.isLoggedIn ? (
          <Chip label="Logged in" color="success" size="small" />
        ) : (
          <Chip label="Logged out" color="default" size="small" />
        )}
        {auth.user?.username ? <Chip label={auth.user.username} size="small" /> : null}
        {auth.user?.roles?.length ? (
          <Chip label={(auth.user.roles || []).join(", ")} size="small" />
        ) : null}

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={dbg.enabled}
              onChange={(e) => dbg.setEnabled(e.target.checked)}
            />
          }
          label="Debug"
          sx={{ ml: 0.5 }}
        />

        <Box sx={{ flex: 1 }} />

        {!auth.isLoggedIn ? (
          <Button variant="contained" onClick={() => setLoginOpen(true)}>
            Login
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => void auth.refresh()} disabled={auth.busy}>
              Refresh
            </Button>
            <Button variant="outlined" onClick={() => void loadUsers()} disabled={auth.busy}>
              Reload users
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => void auth.logout()}
              disabled={auth.busy}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Stack>

      <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto auto auto 1fr", gap: 1 }}>
        {auth.lastError ? (
          <Alert severity="error">{`${auth.lastError.code}: ${auth.lastError.message}`}</Alert>
        ) : null}
        {panelError ? (
          <Alert severity="error">{`${panelError.code}: ${panelError.message}`}</Alert>
        ) : null}

        <DebugLogViewer />

        <Divider />

        {auth.isLoggedIn ? (
          <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr", gap: 1 }}>
            {!isAdmin ? (
              <Alert severity="warning">
                This account does not have <code>admin</code> role. Admin endpoints will be
                forbidden.
              </Alert>
            ) : null}

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ flex: 1 }}>
                Users
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setFormError(undefined);
                  setCreateOpen(true);
                }}
                disabled={!isAdmin}
              >
                Create user
              </Button>
            </Stack>

            <AdminUsersTable
              users={users}
              onEdit={(u) => {
                setFormError(undefined);
                setEditUser(u);
              }}
              onDelete={(u) => void doDelete(u)}
            />
          </Box>
        ) : (
          <Alert severity="info">Login to manage users.</Alert>
        )}
      </Box>

      <LoginModal
        open={loginOpen}
        title="Admin Login"
        defaultUsername="admin"
        onClose={() => setLoginOpen(false)}
        onSubmit={doLogin}
        busy={auth.busy}
        error={auth.lastError}
      />

      <AdminUserFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onCreate={doCreate}
        onUpdate={async () => {}}
        busy={auth.busy}
        error={formError}
      />

      <AdminUserFormModal
        open={!!editUser}
        mode="edit"
        initialUser={editUser}
        onClose={() => setEditUser(undefined)}
        onCreate={async () => {}}
        onUpdate={doUpdate}
        busy={auth.busy}
        error={formError}
      />
    </Paper>
  );
}
