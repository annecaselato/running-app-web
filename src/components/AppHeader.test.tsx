import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from './AppHeader';
import { logout } from '../logout';

const mockNavigate = jest.fn();
const mockHandleDrawerOpen = jest.fn();

jest.mock('../logout');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderHeader = () =>
  render(<AppHeader title="My Title" openDrawer={false} handleDrawerOpen={mockHandleDrawerOpen} />);

describe('AppHeader', () => {
  it('renders without errors', () => {
    renderHeader();

    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('should hide menu button when drawer is open', () => {
    render(
      <AppHeader title="My Title" openDrawer={true} handleDrawerOpen={mockHandleDrawerOpen} />
    );
    expect(screen.getByLabelText('open drawer')).not.toBeVisible();
  });

  it('renders user menu', () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText('menu-button'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('handles account page navigation', () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText('menu-button'));
    fireEvent.click(screen.getByText('Profile'));

    expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
  });

  it('handles sign out action', () => {
    renderHeader();

    localStorage.setItem('test-item', 'test-value');

    fireEvent.click(screen.getByLabelText('menu-button'));
    fireEvent.click(screen.getByText('Sign out'));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
