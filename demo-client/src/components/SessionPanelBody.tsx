import React from "react";
import { Alert, Box, Divider } from "@mui/material";
import type { ApiError } from "../api/apiClient";
import { DebugLogViewer } from "./DebugLogViewer";

export function SessionPanelBody(props: {
  authError?: ApiError;
  panelError?: ApiError;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto auto auto 1fr", gap: 1 }}>
      {props.authError ? (
        <Alert severity="error">{`${props.authError.code}: ${props.authError.message}`}</Alert>
      ) : null}
      {props.panelError ? (
        <Alert severity="error">{`${props.panelError.code}: ${props.panelError.message}`}</Alert>
      ) : null}

      <DebugLogViewer />

      <Divider />

      {props.children}
    </Box>
  );
}
