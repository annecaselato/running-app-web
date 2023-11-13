import { Box, CssBaseline, Grid, Paper } from '@mui/material';
import BackgroundImage from '../assets/background.jpg';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function BackgroundPage({ children }: PageContainerProps) {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        md={8}
        sx={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (theme) => theme.palette.grey[50],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        data-testid="background-image"
      />
      <Grid item xs={12} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            margin: 4,
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}
