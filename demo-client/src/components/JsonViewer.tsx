import { Box } from "@mui/material";
import React, { useMemo } from "react";

export function JsonViewer(props: { value: unknown }) {
  const txt = useMemo(() => JSON.stringify(props.value, null, 2), [props.value]);
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "auto",
        fontSize: 12
      }}
    >
      {txt}
    </Box>
  );
}
