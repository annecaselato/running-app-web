import { Category, DirectionsRun, Groups, Home } from '@mui/icons-material';

export const menuItems = [
  {
    text: 'Home',
    icon: Home,
    page: '/'
  },
  {
    text: 'Activity',
    icon: DirectionsRun,
    page: '/activity'
  },
  {
    text: 'Types',
    icon: Category,
    page: '/types'
  },
  {
    text: 'Teams',
    icon: Groups,
    page: '/teams'
  }
];
