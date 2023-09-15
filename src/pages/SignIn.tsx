import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import PasswordInput from '../components/PasswordInput';
import { GoogleCredentialResponse, GoogleLogin } from '@react-oauth/google';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(signInInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        name
        email
      }
    }
  }
`;

export const SIGN_IN_OIDC = gql`
  mutation SignInOIDC($token: String!) {
    signInOIDC(signInOIDCInput: { token: $token }) {
      access_token
      user {
        id
        name
        email
      }
    }
  }
`;

const signInSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export default function SignIn() {
  const navigate = useNavigate();
  const [signIn] = useMutation(SIGN_IN);
  const [signInOIDC] = useMutation(SIGN_IN_OIDC);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(signInSchema) });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await signIn({
        variables: {
          email: values.email,
          password: values.password
        }
      });

      if (response?.data) {
        const { access_token, user } = response.data.signIn;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(`Sign in failed: ${err.graphQLErrors[0].message}`, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleGoogleLogin = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      const response = await signInOIDC({
        variables: {
          token: credentialResponse.credential
        }
      });

      if (response?.data) {
        const { access_token, user } = response.data.signInOIDC;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error('Sign in failed. Please try again.', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

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
              <PasswordInput label="Password" name="password" register={register} errors={errors} />
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
          <GoogleLogin
            data-testid="google-login"
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast.error('Sign in failed. Please try again.', {
                position: toast.POSITION.BOTTOM_CENTER
              });
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
