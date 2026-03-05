import { Box } from "@mui/material";
import React from "react";

export function SplitLayout(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        height: "100vh",
        p: 2,
        boxSizing: "border-box"
      }}
    >
      {props.left}
      {props.right}
    </Box>
  );
}
