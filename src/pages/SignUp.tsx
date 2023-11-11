import { ApolloError, gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { SIGN_IN } from './SignIn';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'react-toastify';
import BackgroundPage from '../components/BackgroundPage';
import BackgroundImage from '../assets/background-1.jpg';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(createUserInput: { email: $email, name: $name, password: $password }) {
      name
      email
    }
  }
`;

const userSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(
      8,
      'Must contain 8 or more characters with at least one of each:\n uppercase, lowercase, number and symbol'
    )
    .matches(/(?=.*[a-z])/, 'Must contain at least 1 lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Must contain at least 1 uppercase letter')
    .matches(/(?=.*\d)/, 'Must contain at least 1 number')
    .matches(/(?=.*\W)/, 'Must contain at least 1 special character')
});

export default function SignUp() {
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [signIn, { data }] = useMutation(SIGN_IN);
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
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  if (data) {
    const { access_token, user } = data.signIn;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    navigate('/sign-up/profile', { replace: true });
  }

  return (
    <BackgroundPage image={`url(${BackgroundImage})`}>
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
              autoFocus
              id="name"
              label="Name"
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
            <PasswordInput label="Password" name="password" register={register} errors={errors} />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Link href="/sign-in">Already have an account? Sign In</Link>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPage>
  );
}
