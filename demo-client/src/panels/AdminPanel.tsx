import React from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { LoginModal } from "../components/LoginModal";
import { AdminUsersTable } from "../features/adminUsers/AdminUsersTable";
import { AdminUserFormModal } from "../features/adminUsers/AdminUserFormModal";
import { useDebug } from "../debug/DebugContext";
import { getFunctionsBaseUrl } from "../config";
import { useAdminPanelModel } from "../hooks/useAdminPanelModel";
import { SessionPanelChrome } from "../components/SessionPanelChrome";
import { SessionPanelBody } from "../components/SessionPanelBody";

export function AdminPanel() {
  const dbg = useDebug();
  const vm = useAdminPanelModel();

  return (
    <SessionPanelChrome
      title="Admin Panel"
      sessionKeyLabel="auth.admin.*"
      functionsBaseUrl={getFunctionsBaseUrl()}
      isLoggedIn={vm.auth.isLoggedIn}
      {...(vm.auth.user?.username ? { username: vm.auth.user.username } : {})}
      {...(vm.auth.user?.roles?.length ? { roles: vm.auth.user.roles } : {})}
      debugEnabled={dbg.enabled}
      onDebugEnabledChange={dbg.setEnabled}
      onLogin={() => vm.setLoginOpen(true)}
      onRefresh={() => void vm.auth.refresh()}
      onLogout={() => void vm.auth.logout()}
      busy={vm.auth.busy}
      actions={
        <Button variant="outlined" onClick={() => void vm.loadUsers()} disabled={vm.auth.busy}>
          Reload users
        </Button>
      }
    >
      <SessionPanelBody
        {...(vm.auth.lastError ? { authError: vm.auth.lastError } : {})}
        {...(vm.panelError ? { panelError: vm.panelError } : {})}
      >
        {vm.auth.isLoggedIn ? (
          <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr", gap: 1 }}>
            {!vm.isAdmin ? (
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
                  vm.setFormError(undefined);
                  vm.setCreateOpen(true);
                }}
                disabled={!vm.isAdmin}
              >
                Create user
              </Button>
            </Stack>

            <AdminUsersTable
              users={vm.users}
              onEdit={(u) => {
                vm.setFormError(undefined);
                vm.setEditUser(u);
              }}
              onDelete={(u) => void vm.doDelete(u)}
              onRevokeSession={(u) => void vm.doRevokeSession(u)}
            />
          </Box>
        ) : (
          <Alert severity="info">Login to manage users.</Alert>
        )}
      </SessionPanelBody>

      <LoginModal
        open={vm.loginOpen}
        title="Admin Login"
        defaultUsername="admin"
        onClose={() => vm.setLoginOpen(false)}
        onSubmit={vm.doLogin}
        busy={vm.auth.busy}
        {...(vm.auth.lastError ? { error: vm.auth.lastError } : {})}
      />

      <AdminUserFormModal
        open={vm.createOpen}
        mode="create"
        onClose={() => vm.setCreateOpen(false)}
        onCreate={vm.doCreate}
        onUpdate={async () => {}}
        busy={vm.auth.busy}
        {...(vm.formError ? { error: vm.formError } : {})}
      />

      <AdminUserFormModal
        open={!!vm.editUser}
        mode="edit"
        {...(vm.editUser ? { initialUser: vm.editUser } : {})}
        onClose={() => vm.setEditUser(undefined)}
        onCreate={async () => {}}
        onUpdate={vm.doUpdate}
        busy={vm.auth.busy}
        {...(vm.formError ? { error: vm.formError } : {})}
      />
    </SessionPanelChrome>
  );
}
