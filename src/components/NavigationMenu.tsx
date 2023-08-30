import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  styled,
  SvgIcon
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { menuItems } from '../constants/menuItems';

interface AppDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export default function NavigationMenu({ open, handleDrawerClose }: AppDrawerProps) {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(page, { replace: true });
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box'
        }
      }}
      variant="persistent"
      anchor="left"
      open={open}>
      <DrawerHeader>
        <IconButton aria-label="close drawer" onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.page)}>
              <ListItemIcon>
                <SvgIcon component={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
