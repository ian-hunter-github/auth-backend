import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DemoPage } from "./pages/DemoPage";

const theme = createTheme({
  palette: {
    mode: "light"
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DemoPage />
    </ThemeProvider>
  );
}
