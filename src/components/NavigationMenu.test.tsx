import { render, screen, fireEvent } from '@testing-library/react';
import NavigationMenu from './NavigationMenu';

const mockHandleDrawerClose = jest.fn();

const renderNav = () =>
  render(<NavigationMenu open={true} handleDrawerClose={mockHandleDrawerClose} />);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('NavigationMenu', () => {
  it('renders without errors', () => {
    renderNav();

    const menuHome = screen.getByText('Home');
    expect(menuHome).toBeInTheDocument();
  });

  it('handles menu item click and navigation', () => {
    renderNav();

    const menuItem = screen.getByText('Home');
    fireEvent.click(menuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
