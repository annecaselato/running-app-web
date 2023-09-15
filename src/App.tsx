import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AppRoutes from './AppRoutes';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        <AppRoutes />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
