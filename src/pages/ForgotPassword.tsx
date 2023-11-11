import { ApolloError, gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BackgroundPage from '../components/BackgroundPage';
import BackgroundImage from '../assets/background-1.jpg';

export const REQUEST_RECOVERY = gql`
  mutation RequestRecovery($email: String!) {
    requestRecovery(requestRecoveryInput: { email: $email })
  }
`;

const schema = yup.object({
  email: yup.string().required('Email is required').email()
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [requestRecovery] = useMutation(REQUEST_RECOVERY);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });

  const onSubmit = async (values: { email: string }) => {
    try {
      const response = await requestRecovery({
        variables: {
          email: values.email
        }
      });

      if (response && response.data) {
        toast.success('Recovery email was sent', {
          position: toast.POSITION.BOTTOM_CENTER
        });

        navigate('/sign-in', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error('An error occurred. Please try again.', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  return (
    <BackgroundPage image={`url(${BackgroundImage})`}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Password Recovery
      </Typography>
      <Typography>
        Please enter the email associated with your account, and a password reset link will be sent.
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 2, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email && (errors.email.message as string)}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Request link
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Link href="/sign-in">Go back to Sign In</Link>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPage>
  );
}
