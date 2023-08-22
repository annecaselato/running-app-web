import ThemeProvider from '@mui/material/styles/ThemeProvider';
import './App.css';
import AppRoutes from './AppRoutes';
import { theme } from './theme';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}
