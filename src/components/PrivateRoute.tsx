import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const user = {
    name: 'User'
  };

  if (user) {
    return <Navigate to={'/sign-in'} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
