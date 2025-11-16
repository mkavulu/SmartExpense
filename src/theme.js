import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: { default: "#f4f6f8" },
          }
        : {
            background: { default: "#121212" },
          }),
    },
  });
