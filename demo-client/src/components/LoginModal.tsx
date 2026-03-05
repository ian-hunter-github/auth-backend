import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { ApiError } from "../api/apiClient";

export function LoginModal(props: {
  open: boolean;
  title: string;
  defaultUsername?: string;
  defaultPassword?: string;
  onClose: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
  busy?: boolean;
  error?: ApiError;
}) {
  const [username, setUsername] = useState(props.defaultUsername || "");
  const [password, setPassword] = useState(props.defaultPassword || "196900");

  useEffect(() => {
    if (props.open) {
      setUsername(props.defaultUsername || "");
      setPassword("");
    }
  }, [props.open, props.defaultUsername]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault?.();
    await props.onSubmit(username, password);
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.busy ? undefined : props.onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, pt: 1 }}>
          {props.error ? (
            <Alert severity="error">{`${props.error.code}: ${props.error.message}`}</Alert>
          ) : null}

          <TextField
            label="Email / Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />
          <TextField
            label="Password"
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />
          <button type="submit" style={{ display: "none" }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={!!props.busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!!props.busy || !username || !password}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
