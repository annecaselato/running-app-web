import './App.css';
import { AppRoutes } from './AppRoutes';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
