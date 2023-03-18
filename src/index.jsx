import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // mode: "dark",
    primary: {
      main: "#3070af",
    
    },
    secondary: {
      main: "#e0e0e0  ",
     
    },
    error: {
      main: "#d90b19",
      
    },
    darkBackground: {
      main: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },
    MuiTextField: {
     
    },
  },
});

// disable react dev tools
// disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
