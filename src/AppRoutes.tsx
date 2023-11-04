import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import Types from './pages/Types';
import SelectProfile from './pages/SelectProfile';
import Teams from './pages/Teams';
import TeamMembers from './pages/TeamMembers';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up/profile" element={<SelectProfile />} />
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/types" element={<Types />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamMembers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
