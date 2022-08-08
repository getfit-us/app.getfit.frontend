import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthProvider";
import { ProfileProvider } from './context/ProfileProvider';

import {createTheme, ThemeProvider } from '@mui/material/styles';

import { green, purple , blue} from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(7, 47, 107)'
    },
    secondary: {
      main: 'rgb(26, 156, 78)',
    },
  },
});







const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
 <AuthProvider>
<ThemeProvider theme={theme}>
<ProfileProvider>
    <App />
    </ProfileProvider>
    </ThemeProvider>
    </AuthProvider>

  // </React.StrictMode>
);

