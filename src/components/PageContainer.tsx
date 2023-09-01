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
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
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
    <Box sx={{ display: 'flex' }}>
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
