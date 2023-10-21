import { FetchResult } from '@apollo/client';
import { useForm } from 'react-hook-form';
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

const activitySchema = yup.object({
  type: yup.string().required('Type is required').max(40),
  description: yup.string().max(300).optional()
});

export interface TypeBody {
  type: string;
  description?: string;
}

export interface Type {
  id: string;
  type: string;
  description?: string;
}

interface TypeFormProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCreate: (type: TypeBody) => Promise<FetchResult<any> | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUpdate: (id: string, type: TypeBody) => Promise<FetchResult<any> | undefined>;
  edit: Type | undefined;
}

export default function TypeForm({
  open,
  handleClose,
  handleCreate,
  handleUpdate,
  edit
}: TypeFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm({ mode: 'onChange', resolver: yupResolver(activitySchema) });

  const onClose = () => {
    reset();
    handleClose();
  };

  const onSubmit = async (values: { type: string; description?: string }) => {
    const response = edit ? await handleUpdate(edit.id, values) : await handleCreate(values);

    if (response && response.data) onClose();
  };

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography
            id="add-activity-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: 'center' }}>
            {edit ? 'Edit Type' : 'Add Type'}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="type"
                  label="Type"
                  defaultValue={edit?.type}
                  {...register('type')}
                  error={!!errors.type}
                  helperText={errors.type && (errors.type.message as string)}
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
