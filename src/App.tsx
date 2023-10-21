import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AppRoutes from './AppRoutes';
import { theme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
          <AppRoutes />
        </GoogleOAuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
