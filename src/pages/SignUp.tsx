import { ApolloError, gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { SIGN_IN } from './SignIn';
import { ToastContainer, toast } from 'react-toastify';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(createUserInput: { email: $email, name: $name, password: $password }) {
      name
      email
    }
  }
`;

const userSchema = yup.object({
  name: yup.string().trim().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(5)
});

const onError = (error: ApolloError) => {
  toast.error(error.message, {
    position: toast.POSITION.BOTTOM_CENTER
  });
};

export default function SignUp() {
  const [createUser] = useMutation(CREATE_USER, { onError });
  const [signIn, { data }] = useMutation(SIGN_IN, { onError });
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(userSchema) });

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      const response = await createUser({
        variables: {
          name: values.name,
          email: values.email,
          password: values.password
        }
      });

      if (response && response.data) {
        signIn({ variables: { email: values.email, password: values.password } });
      }
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name && (errors.name.message as string)}
              />
            </Grid>
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        <ToastContainer />
      </Box>
    </Container>
  );
}
