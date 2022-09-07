import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthProvider";
import { ProfileProvider } from './context/ProfileProvider';

import {createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    
    primary: {
      main: '#3070af',
      light: '#689ee1',
      dark: '#00457f'
    },
    secondary: {
      main: '#e0e0e0',
      light: '#fffff',
      dark: '#aeaeae'
    },
  },
});







const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 <AuthProvider>
<ThemeProvider theme={theme}>
<ProfileProvider>
    <App />
    </ProfileProvider>
    </ThemeProvider>
    </AuthProvider>

 </React.StrictMode>
);

