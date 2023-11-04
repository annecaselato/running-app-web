import { FetchResult } from '@apollo/client';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { sm: 500, xs: '100%' },
  bgcolor: 'background.paper',
  boxShadow: 12,
  p: 4
};

const membersSchema = yup.object({
  members: yup.array().of(
    yup.object().shape({
      email: yup.string().email('Must be an email').required('Email is required')
    })
  )
});

interface MemberFormProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCreate: (members: string[]) => Promise<FetchResult<any> | undefined>;
}

export default function MemberForm({ open, handleClose, handleCreate }: MemberFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(membersSchema)
  });

  const { fields, prepend, remove, replace } = useFieldArray({ control, name: 'members' });

  const onClose = () => {
    reset();
    replace([]);
    handleClose();
  };

  const onSubmit = async (values: { members?: { email: string }[] }) => {
    const { members } = values;

    const response = await handleCreate(members ? members.map((member) => member.email) : []);

    if (response && response.data) onClose();
  };

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography
            id="add-team-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: 'center' }}>
            {'Add Members'}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button onClick={() => prepend({ email: '' })}>Add Member</Button>
              </Grid>
              {fields.map((field, index) => (
                <Grid item key={field.id}>
                  <TextField
                    label="Email"
                    error={!!errors.members?.[index]?.email}
                    helperText={
                      errors.members?.[index]?.email &&
                      (errors.members?.[index]?.email?.message as string)
                    }
                    {...register(`members.${index}.email`)}
                  />
                  <Button onClick={() => remove(index)}>Remove</Button>
                </Grid>
              ))}
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
