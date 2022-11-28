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
      light: "#689ee1",
      dark: "#00457f",
    },
    secondary: {
      main: "#e0e0e0  ",
      light: "#fffff",
      dark: "#aeaeae",
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
