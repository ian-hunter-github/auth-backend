import React from "react";
import {
  Alert,
  Box,
  Button
} from "@mui/material";
import { LoginModal } from "../components/LoginModal";
import { EditProfileModal } from "../components/EditProfileModal";
import { JsonViewer } from "../components/JsonViewer";
import { useDebug } from "../debug/DebugContext";
import { getFunctionsBaseUrl } from "../config";
import { useUserPanelModel } from "../hooks/useUserPanelModel";
import { SessionPanelChrome } from "../components/SessionPanelChrome";
import { SessionPanelBody } from "../components/SessionPanelBody";

export function UserPanel() {
  const dbg = useDebug();
  const vm = useUserPanelModel();

  return (
    <SessionPanelChrome
      title="User Panel"
      sessionKeyLabel="auth.user.*"
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={() => void vm.fetchMe()} disabled={vm.auth.busy}>
            Fetch /me
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              vm.setProfileError(undefined);
              vm.setEditProfileOpen(true);
            }}
            disabled={vm.auth.busy || !vm.auth.isLoggedIn}
          >
            Edit profile
          </Button>
        </Box>
      }
    >
      <SessionPanelBody
        {...(vm.auth.lastError ? { authError: vm.auth.lastError } : {})}
        {...(vm.panelError ? { panelError: vm.panelError } : {})}
      >
        <Box sx={{ minHeight: 0 }}>
          {vm.me ? (
            <JsonViewer value={vm.me} />
          ) : (
            <Alert severity="info">Login and click "Fetch /me" to view the authenticated profile JSON.</Alert>
          )}
        </Box>
      </SessionPanelBody>

      <LoginModal
        open={vm.loginOpen}
        title="User Login"
        defaultUsername="user@example.com"
        onClose={() => vm.setLoginOpen(false)}
        onSubmit={vm.doLogin}
        busy={vm.auth.busy}
        {...(vm.auth.lastError ? { error: vm.auth.lastError } : {})}
      />

      <EditProfileModal
        open={vm.editProfileOpen}
        {...(vm.auth.user ? { initialUser: vm.auth.user } : {})}
        onClose={() => vm.setEditProfileOpen(false)}
        onSave={vm.doUpdateMe}
        busy={vm.auth.busy}
        {...(vm.profileError ? { error: vm.profileError } : {})}
      />
    </SessionPanelChrome>
  );
}
