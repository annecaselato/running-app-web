import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const renderRoutes = () => {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route path="/sign-in" element={<div>Sign In Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/private" element={<div>Private Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute', () => {
  it('redirects to sign-in page if not authenticated', () => {
    renderRoutes();
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('renders Outlet if authenticated', () => {
    localStorage.setItem('access_token', 'access-token');

    renderRoutes();

    expect(screen.queryByText('Sign In Page')).toBeNull();
    expect(screen.queryByText('Private Page')).toBeInTheDocument();

    localStorage.removeItem('access_token');
  });
});
