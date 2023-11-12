import { ApolloError, gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import PasswordInput from '../components/PasswordInput';
import BackgroundPage from '../components/BackgroundPage';
import LogoImage from '../assets/original.png';

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(resetPasswordInput: { token: $token, password: $password })
  }
`;

const schema = yup.object({
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
    .matches(/(?=.*\W)/, 'Must contain at least 1 special character'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Password confirmation must match Password')
});

export default function PasswordRecovery() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });

  const onSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      const response = await resetPassword({
        variables: {
          token,
          password: values.password
        }
      });

      if (response && response.data) {
        toast.success('Password changed successfully', {
          position: toast.POSITION.BOTTOM_CENTER
        });
        navigate('/sign-in', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
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
        Reset Password
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PasswordInput label="Password" name="password" register={register} errors={errors} />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              errors={errors}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Reset Password
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
