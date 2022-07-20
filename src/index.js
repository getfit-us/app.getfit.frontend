import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthProvider";


import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
 <AuthProvider>
<ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
    </AuthProvider>

  // </React.StrictMode>
);

