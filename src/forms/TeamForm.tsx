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

const teamSchema = yup.object({
  name: yup.string().required('Name is required').max(40),
  description: yup.string().max(300).optional(),
  members: yup.array().of(
    yup.object().shape({
      email: yup.string().email('Must be an email').required('Email is required')
    })
  )
});

export interface TeamBody {
  name: string;
  description?: string;
  members?: string[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: { email: string }[];
}

interface TeamFormProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCreate: (type: TeamBody) => Promise<FetchResult<any> | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUpdate: (id: string, type: TeamBody) => Promise<FetchResult<any> | undefined>;
  edit: Team | undefined;
}

export default function TeamForm({
  open,
  handleClose,
  handleCreate,
  handleUpdate,
  edit
}: TeamFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(teamSchema)
  });

  const { fields, prepend, remove, replace } = useFieldArray({ control, name: 'members' });

  const onClose = () => {
    reset();
    replace([]);
    handleClose();
  };

  const onSubmit = async (values: {
    name: string;
    description?: string;
    members?: { email: string }[];
  }) => {
    const { name, description, members } = values;
    const response = edit
      ? await handleUpdate(edit.id, { name, description })
      : await handleCreate({
          name,
          description,
          members: members ? members.map((member) => member.email) : []
        });

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
            {edit ? 'Edit Team' : 'Add Team'}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  label="Name"
                  defaultValue={edit?.name}
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name && (errors.name.message as string)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  label="Description"
                  defaultValue={edit?.description}
                  multiline
                  rows={4}
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description && (errors.description.message as string)}
                />
              </Grid>
              {!edit && (
                <>
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
                </>
              )}
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
