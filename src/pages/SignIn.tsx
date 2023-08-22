import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, gql, useMutation } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(signInInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        name
      }
    }
  }
`;

const signInSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const onError = (error: ApolloError) => {
  toast.error(error.message, {
    position: toast.POSITION.BOTTOM_CENTER
  });
};

export default function SignIn() {
  const [signIn, { data }] = useMutation(SIGN_IN, { onError });
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(signInSchema) });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      await signIn({
        variables: {
          email: values.email,
          password: values.password
        }
      });
    } catch {
      toast.error('An error occurred. Please try again.');
    }
  };

  if (data) {
    const { access_token, user } = data.signIn;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return <Navigate to={'/'} replace />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password && (errors.password.message as string)}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
        <ToastContainer />
      </Box>
    </Container>
  );
}
