import React from "react";
import type { AuthUserProfile } from "../../types/authTypes";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export function AdminUsersTable(props: {
  users: AuthUserProfile[];
  onEdit: (u: AuthUserProfile) => void;
  onDelete: (u: AuthUserProfile) => void;
  onRevokeSession: (u: AuthUserProfile) => void;
  onDisable: (u: AuthUserProfile) => void;
  onEnable: (u: AuthUserProfile) => void;
}) {
  return (
    <Box sx={{ overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Email</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Display name</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Roles</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
            <TableCell sx={{ width: 144, textAlign: "right" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users.length ? (
            props.users.map((u) => (
              <TableRow key={u.id} hover sx={u.disabled ? { opacity: 0.6 } : {}}>
                <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{u.id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{u.username}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{u.displayName}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{(u.roles || []).join(", ")}</TableCell>
                <TableCell>
                  {u.disabled ? (
                    <Chip label="Disabled" size="small" color="warning" variant="outlined" />
                  ) : (
                    <Chip label="Active" size="small" color="success" variant="outlined" />
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => props.onEdit(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Revoke all sessions">
                    <IconButton size="small" onClick={() => props.onRevokeSession(u)}>
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {u.disabled ? (
                    <Tooltip title="Enable account">
                      <IconButton size="small" color="success" onClick={() => props.onEnable(u)}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Disable account">
                      <IconButton size="small" color="warning" onClick={() => props.onDisable(u)}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => props.onDelete(u)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  No users loaded.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!props.users.length ? (
        <Box sx={{ p: 1 }}>
          <Button size="small" disabled>
            No rows
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
