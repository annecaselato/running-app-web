import { render, screen } from '@testing-library/react';
import AppRoutes from './AppRoutes';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children
  };
});

jest.mock('./pages/SignIn', () => ({
  __esModule: true,
  default: () => <div>Mocked SignIn</div>
}));

jest.mock('./pages/Home', () => ({
  __esModule: true,
  default: () => <div>Mocked Home</div>
}));

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>
  );

describe('AppRoutes', () => {
  test('renders sign-in page for unauthenticated user', () => {
    renderHome();

    expect(screen.getByText('Mocked SignIn')).toBeInTheDocument();
  });

  test('renders home page for authenticated user', () => {
    localStorage.setItem('access_token', 'access-token');

    renderHome();

    expect(screen.getByText('Mocked Home')).toBeInTheDocument();

    localStorage.removeItem('access_token');
  });
});
