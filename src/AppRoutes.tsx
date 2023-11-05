import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import Types from './pages/Types';
import SelectProfile from './pages/SelectProfile';
import CoachTeams from './pages/CoachTeams';
import TeamMembers from './pages/TeamMembers';
import { EnumProfiles } from './models/EnumProfiles';
import AthleteTeams from './pages/AthleteTeams';

export default function AppRoutes() {
  const userString = localStorage.getItem('user');
  const user = userString && JSON.parse(userString);
  const profile = user && user.profile;

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
          <Route
            path="/teams"
            element={profile === EnumProfiles.COACH ? <CoachTeams /> : <AthleteTeams />}
          />
          <Route path="/teams/:id" element={<TeamMembers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
