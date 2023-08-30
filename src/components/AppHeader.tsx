import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  styled
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { AccountCircle, Logout, Menu as MenuIcon, PersonOutline } from '@mui/icons-material';

interface AppHeaderProps {
  title: string;
  openDrawer: boolean;
  handleDrawerOpen: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: 'calc(100% - 240px)',
    marginLeft: '240px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export default function AppHeader({ title, openDrawer, handleDrawerOpen }: AppHeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccount = () => {
    handleMenuClose();
    navigate('/profile', { replace: true });
  };

  const handleSignOut = () => {
    handleMenuClose();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppBar position="fixed" open={openDrawer}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="menu-button"
          aria-controls={openMenu ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
          onClick={handleMenuClick}
          edge="end"
          size="small">
          <AccountCircle fontSize="large" />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'menu-button'
          }}>
          <MenuItem onClick={handleAccount}>
            <ListItemIcon>
              <PersonOutline fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
