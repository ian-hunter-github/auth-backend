import React, { useMemo, useState } from "react";
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import { useDebug } from "../debug/DebugContext";
import { JsonViewer } from "./JsonViewer";

export function DebugLogViewer() {
  const dbg = useDebug();
  const [open, setOpen] = useState(false);

  const latest = useMemo(() => dbg.logs[0], [dbg.logs]);

  if (!dbg.enabled) return null;

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          Debug log ({dbg.logs.length})
        </Typography>

        <Button size="small" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : "Show"}
        </Button>
        <Button size="small" color="error" onClick={dbg.clear} disabled={!dbg.logs.length}>
          Clear
        </Button>
      </Stack>

      {latest ? (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Latest: {latest.method} {latest.path} → {latest.status} in {latest.ms}ms
          </Typography>
        </Box>
      ) : null}

      <Collapse in={open}>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "grid", gap: 1 }}>
          {dbg.logs.length ? (
            dbg.logs.map((e) => (
              <Box key={e.id} sx={{ display: "grid", gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  {e.atIso} | {e.method} {e.path} | {e.status} | {e.ms}ms | {e.ok ? "OK" : "ERR"}
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Request
                    </Typography>
                    <JsonViewer value={e.requestBody ?? null} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Response
                    </Typography>
                    <JsonViewer value={e.responseBody ?? (e.errorMessage ? { errorMessage: e.errorMessage } : null)} />
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No calls recorded yet.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
