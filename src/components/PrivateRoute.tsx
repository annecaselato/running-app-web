import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


export class PrivateRoute extends React.Component {
  render() {
    const user = {
      name: 'User'
    }

    if (user) {
      return (
        <Navigate to={'/sign-in'} replace />
      );
    }
  
    return (
      <Outlet />
    );
  };
}
