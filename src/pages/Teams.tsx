import { EnumProfiles } from '../models/EnumProfiles';
import AthleteTeams from './AthleteTeams';
import CoachTeams from './CoachTeams';

export default function Teams() {
  const userString = localStorage.getItem('user');
  const user = userString && JSON.parse(userString);

  if (user.profile === EnumProfiles.COACH) {
    return <CoachTeams />;
  }

  return <AthleteTeams />;
}
