import React, { useState } from 'react';
import { styled, CssBaseline, Box } from '@mui/material';
import AppHeader from './AppHeader';
import NavigationMenu from './NavigationMenu';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
  width: '100%',
  marginTop: 3,
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    [theme.breakpoints.up('sm')]: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }
  })
}));

const ContentLimit = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar
}));

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      height={window.innerHeight}
      sx={{
        display: 'flex',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}>
      <CssBaseline />
      <AppHeader title={title} openDrawer={open} handleDrawerOpen={handleDrawerOpen} />
      <NavigationMenu open={open} handleDrawerClose={handleDrawerClose} />
      <Main open={open}>
        <ContentLimit />
        {children}
      </Main>
    </Box>
  );
}
