import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { ApiError } from "../../api/apiClient";
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from "../../types/adminUsersTypes";
import type { AuthUserProfile } from "../../types/authTypes";

function splitRoles(v: string): string[] | undefined {
  const parts = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function joinRoles(v: string[] | undefined): string {
  return (v || []).join(", ");
}

export function AdminUserFormModal(props: {
  open: boolean;
  mode: "create" | "edit";
  initialUser?: AuthUserProfile;
  onClose: () => void;
  onCreate: (req: AdminCreateUserRequest) => Promise<void>;
  onUpdate: (req: AdminUpdateUserRequest) => Promise<void>;
  busy?: boolean;
  error?: ApiError;
}) {
  const title = useMemo(() => (props.mode === "create" ? "Create User" : "Edit User"), [props.mode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roles, setRoles] = useState("user");

  useEffect(() => {
    if (!props.open) return;

    if (props.mode === "create") {
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRoles("user");
      return;
    }

    const u = props.initialUser;
    setEmail(u?.username || "");
    setPassword("");
    setDisplayName(u?.displayName || "");
    setRoles(joinRoles(u?.roles));
  }, [props.open, props.mode, props.initialUser]);

  async function submit() {
    if (props.mode === "create") {
      const nextRoles = splitRoles(roles);
      await props.onCreate({
        email: email.trim(),
        password,
        ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
        ...(nextRoles ? { roles: nextRoles } : {})
      });
      return;
    }

    const nextRoles = splitRoles(roles);
    await props.onUpdate({
      ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
      ...(nextRoles ? { roles: nextRoles } : {})
    });
  }

  const canSubmit =
    props.mode === "create" ? !!email.trim() && !!password : !!displayName.trim() || !!splitRoles(roles);

  return (
    <Dialog open={props.open} onClose={props.busy ? undefined : props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
          {props.error ? <Alert severity="error">{`${props.error.code}: ${props.error.message}`}</Alert> : null}

          {props.mode === "create" ? (
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
          ) : (
            <TextField label="Email" value={email} disabled fullWidth />
          )}

          {props.mode === "create" ? (
            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
          ) : null}

          <TextField
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />

          <TextField
            label="Roles (comma separated)"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            disabled={!!props.busy}
            fullWidth
            helperText="Examples: user   or   admin, user"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={!!props.busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void submit()} disabled={!!props.busy || !canSubmit}>
          {props.mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
