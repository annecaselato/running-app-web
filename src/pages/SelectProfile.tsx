import { Grid, Typography } from '@mui/material';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import BackgroundPage from '../components/BackgroundPage';
import BackgroundImage from '../assets/background-4.jpg';
import AthleteImage from '../assets/athlete.jpg';
import CoachImage from '../assets/coach.jpg';
import { EnumProfiles } from '../models/EnumProfiles';
import { useEffect } from 'react';

export const UPDATE_PROFILE = gql`
  mutation updateProfile($profile: String!) {
    updateProfile(updateProfileInput: { profile: $profile }) {
      id
      name
      email
      profile
    }
  }
`;

export default function SelectProfile() {
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (!token) {
      navigate('/sign-in', { replace: true });
    }
  }, []);

  const handleUpdate = async (profile: string) => {
    try {
      const response = await updateProfile({ variables: { profile } });

      if (response && response.data) {
        const user = response.data.updateProfile;
        localStorage.setItem('user', JSON.stringify(user));
      }

      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error('Update failed. Please try again.', { position: toast.POSITION.BOTTOM_CENTER });
      }
    }
  };

  return (
    <BackgroundPage image={`url(${BackgroundImage})`}>
      <Typography component="h1" variant="h5">
        Choose Your Profile
      </Typography>
      <Typography>Customize your experience by selecting a profile:</Typography>
      <Grid container spacing={2} justifyContent="center" direction="column" sx={{ marginTop: 2 }}>
        <Grid item xs={5}>
          <ActionCard
            title="Athlete"
            description="Track your running activities and join teams."
            image={AthleteImage}
            onClick={() => handleUpdate(EnumProfiles.ATHLETE)}
          />
        </Grid>
        <Grid item xs={5}>
          <ActionCard
            title="Coach"
            description="Manage teams, create training plans, and guide athletes."
            image={CoachImage}
            onClick={() => handleUpdate(EnumProfiles.COACH)}
          />
        </Grid>
      </Grid>
    </BackgroundPage>
  );
}
