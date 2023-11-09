import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = localStorage.getItem('access_token');
  const userString = localStorage.getItem('user');
  const user = userString && JSON.parse(userString);

  if (!token) {
    return <Navigate to={'/sign-in'} replace />;
  }

  if (!user.profile) {
    return <Navigate to={'/sign-up/profile'} replace />;
  }

  return <Outlet />;
}
