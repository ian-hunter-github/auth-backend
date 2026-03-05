import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { LoginModal } from "../components/LoginModal";
import { JsonViewer } from "../components/JsonViewer";
import { usePanelApis } from "../hooks/useApi";
import type { ApiError } from "../api/apiClient";
import type { MeResponse } from "../types/meTypes";

export function UserPanel() {
  const auth = useAuth();
  const { userApi } = usePanelApis();

  const [loginOpen, setLoginOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | undefined>(undefined);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setMe(undefined);
      setPanelError(undefined);
    }
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function fetchMe() {
    setPanelError(undefined);
    try {
      const res = await userApi.me();
      setMe(res);
    } catch (err) {
      setPanelError(err as ApiError);
      setMe(undefined);
    }
  }

  return (
    <Paper sx={{ p: 2, height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 1.5 }}>
      <Box>
        <Typography variant="h6">User Panel</Typography>
        <Typography variant="body2" color="text.secondary">
          Independent session: <code>auth.user.*</code>
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        {auth.isLoggedIn ? (
          <Chip label="Logged in" color="success" size="small" />
        ) : (
          <Chip label="Logged out" color="default" size="small" />
        )}
        {auth.user?.username ? <Chip label={auth.user.username} size="small" /> : null}
        {auth.user?.roles?.length ? <Chip label={(auth.user.roles || []).join(", ")} size="small" /> : null}

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
            <Button variant="contained" onClick={() => void fetchMe()} disabled={auth.busy}>
              Fetch /me
            </Button>
            <Button variant="contained" color="error" onClick={() => void auth.logout()} disabled={auth.busy}>
              Logout
            </Button>
          </Stack>
        )}
      </Stack>

      <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto auto 1fr", gap: 1 }}>
        {auth.lastError ? <Alert severity="error">{`${auth.lastError.code}: ${auth.lastError.message}`}</Alert> : null}
        {panelError ? <Alert severity="error">{`${panelError.code}: ${panelError.message}`}</Alert> : null}

        <Divider />

        <Box sx={{ minHeight: 0 }}>
          {me ? (
            <JsonViewer value={me} />
          ) : (
            <Alert severity="info">Login and click “Fetch /me” to view the authenticated profile JSON.</Alert>
          )}
        </Box>
      </Box>

      <LoginModal
        open={loginOpen}
        title="User Login"
        defaultUsername="user@example.com"
        onClose={() => setLoginOpen(false)}
        onSubmit={doLogin}
        busy={auth.busy}
        error={auth.lastError}
      />
    </Paper>
  );
}
