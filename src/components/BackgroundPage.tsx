import { Box, CssBaseline, Grid, Paper } from '@mui/material';

interface PageContainerProps {
  image: string;
  children: React.ReactNode;
}

export default function BackgroundPage({ image, children }: PageContainerProps) {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        md={8}
        sx={{
          backgroundImage: image,
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
