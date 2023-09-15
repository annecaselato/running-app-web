import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, gql, useMutation } from '@apollo/client';
import PageContainer from '../components/PageContainer';
import PasswordInput from '../components/PasswordInput';
import AlertDialog from '../components/Alert';
import { logout } from '../logout';

export const UPDATE_USER = gql`
  mutation updateUser($name: String!) {
    updateUser(updateUserInput: { name: $name }) {
      id
      name
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(updatePasswordInput: { oldPassword: $oldPassword, newPassword: $newPassword })
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser {
    deleteUser
  }
`;

const profileSchema = yup.object({
  name: yup.string().trim().required('Name is required')
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required(),
  newPassword: yup
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

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [openAlert, setOpenAlert] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [deleteUser] = useMutation(DELETE_USER);

  const {
    handleSubmit: profileHandleSubmit,
    register: profileRegister,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({ mode: 'onChange', resolver: yupResolver(profileSchema) });

  const {
    handleSubmit: passwordHandleSubmit,
    register: passwordRegister,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({ mode: 'onChange', resolver: yupResolver(passwordSchema) });

  const onSubmitProfile = async (values: { name: string }) => {
    try {
      const response = await updateUser({ variables: { name: values.name } });

      if (response && response.data.updateUser) {
        const newUser = { ...user, ...response.data.updateUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        toast.success('Update was successful!', { position: toast.POSITION.BOTTOM_CENTER });
        resetProfile({ name: newUser.name });
      }
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error('Update failed. Please try again.', { position: toast.POSITION.BOTTOM_CENTER });
      }
    }
  };

  const onSubmitPassword = async (values: { oldPassword: string; newPassword: string }) => {
    try {
      await updatePassword({
        variables: { oldPassword: values.oldPassword, newPassword: values.newPassword }
      });

      toast.success('Update was successful!', { position: toast.POSITION.BOTTOM_CENTER });
      resetPassword();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error('Update failed. Please try again.', { position: toast.POSITION.BOTTOM_CENTER });
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      logout();
    } catch {
      toast.error('An error occurred. Please try again.', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  return (
    <PageContainer title={'Profile'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          maxWidth: 500,
          padding: 3
        }}>
        <Typography component="h1" variant="h5">
          Edit Profile
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={profileHandleSubmit(onSubmitProfile)}
          sx={{ mt: 3, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                defaultValue={user.name}
                {...profileRegister('name')}
                error={!!profileErrors.name}
                helperText={profileErrors.name && (profileErrors.name.message as string)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField disabled fullWidth id="email" label="Email" defaultValue={user.email} />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Save changes
          </Button>
        </Box>
        <Typography component="h1" variant="h5">
          Account Settings
        </Typography>
        <Typography component="h2" variant="h6" sx={{ mt: 2 }}>
          Change Password
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={passwordHandleSubmit(onSubmitPassword)}
          sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PasswordInput
                label="Old Password"
                name="oldPassword"
                register={passwordRegister}
                errors={passwordErrors}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="New Password"
                name="newPassword"
                register={passwordRegister}
                errors={passwordErrors}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 3 }}>
            Save changes
          </Button>
        </Box>
        <Typography component="h2" variant="h6">
          Delete Account
        </Typography>
        <Button
          variant="contained"
          color="warning"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => {
            setOpenAlert(true);
          }}>
          Delete Account
        </Button>
        <AlertDialog
          title="Are you sure?"
          text="Once you delete your account, there is no going back."
          open={openAlert}
          handleClose={() => {
            setOpenAlert(false);
          }}
          action={handleDeleteAccount}
        />
      </Box>
    </PageContainer>
  );
}
