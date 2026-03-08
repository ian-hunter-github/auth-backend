import React from "react";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography
} from "@mui/material";

export function SessionPanelChrome(props: {
  title: string;
  sessionKeyLabel: string;
  functionsBaseUrl: string;
  isLoggedIn: boolean;
  username?: string;
  roles?: string[];
  debugEnabled: boolean;
  onDebugEnabledChange: (enabled: boolean) => void;
  onLogin: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  busy?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper sx={{ p: 2, height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 1.5 }}>
      <Box>
        <Typography variant="h6">{props.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Independent session: <code>{props.sessionKeyLabel}</code>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Functions base: <code>{props.functionsBaseUrl}</code>
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        {props.isLoggedIn ? (
          <Chip label="Logged in" color="success" size="small" />
        ) : (
          <Chip label="Logged out" color="default" size="small" />
        )}
        {props.username ? <Chip label={props.username} size="small" /> : null}
        {props.roles?.length ? <Chip label={props.roles.join(", ")} size="small" /> : null}

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={props.debugEnabled}
              onChange={(e) => props.onDebugEnabledChange(e.target.checked)}
            />
          }
          label="Debug"
          sx={{ ml: 0.5 }}
        />

        <Box sx={{ flex: 1 }} />

        {!props.isLoggedIn ? (
          <Button variant="contained" onClick={props.onLogin}>
            Login
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={props.onRefresh} disabled={!!props.busy}>
              Refresh
            </Button>
            {props.actions}
            <Button variant="contained" color="error" onClick={props.onLogout} disabled={!!props.busy}>
              Logout
            </Button>
          </Stack>
        )}
      </Stack>

      {props.children}
    </Paper>
  );
}
