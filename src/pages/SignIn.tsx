import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { GoogleCredentialResponse, GoogleLogin } from '@react-oauth/google';
import PasswordInput from '../components/PasswordInput';
import BackgroundPage from '../components/BackgroundPage';
import LogoImage from '../assets/original.png';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(signInInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        name
        email
        profile
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
        profile
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
    <BackgroundPage>
      <Box
        component="img"
        sx={{
          height: 80,
          margin: 1,
          mb: 3
        }}
        alt="Run Quest logo."
        src={LogoImage}
      />
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3, width: '100%' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            data-testid="google-login"
            onSuccess={handleGoogleLogin}
            width={250}
            size="large"
            onError={() => {
              toast.error('Sign in failed. Please try again.', {
                position: toast.POSITION.BOTTOM_CENTER
              });
            }}
          />
        </Box>
        <Grid container spacing={1} direction="column" alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Link href="/recovery/email">Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link href="/sign-up">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPage>
  );
}
