import { FetchResult, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import { Box, Button, Grid, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import DateTimePicker from './DateTimePicker';
import TimeField from './TimeField';
import SelectField from './SelectField';
import { Type } from './TypeForm';
import { GET_USER_TYPES } from '../pages/Types';

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

const transformNumber = (curr: string, orig: string) => (orig === '' ? undefined : curr);

const activitySchema = yup.object({
  date: yup.date().required('Date is required').typeError('Invalid date'),
  time: yup.date().required('Time is required').typeError('Invalid time'),
  type: yup.string().required('Type is required'),
  status: yup.string().required('Status is required'),
  goalDistance: yup.number().typeError('Must be a number').transform(transformNumber),
  goalDuration: yup.date().nullable().typeError('Must be a time duration'),
  distance: yup.number().typeError('Must be a number').transform(transformNumber),
  duration: yup.date().nullable().typeError('Must be a time duration')
});

const status = [
  { key: 'Planned', value: 'Planned' },
  { key: 'Completed', value: 'Completed' },
  { key: 'Canceled', value: 'Canceled' }
];

interface ActivityBody {
  datetime: Date;
  status: string;
  typeId: string;
  goalDistance?: number | null;
  distance?: number | null;
  goalDuration?: string | null;
  duration?: string | null;
}

export interface Activity {
  id: string;
  datetime: Date;
  status: string;
  type: Type;
  goalDistance?: number | null;
  distance?: number | null;
  goalDuration?: string | null;
  duration?: string | null;
}

interface FormValues {
  date: Date;
  time: Date;
  status: string;
  type: string;
  goalDistance?: number | null;
  distance?: number | null;
  goalDuration?: Date | null;
  duration?: Date | null;
}

interface ActivityFormProps {
  open: boolean;
  handleClose: () => void;
  handleCreate: (type: ActivityBody) => Promise<FetchResult<Activity> | undefined>;
  handleUpdate: (id: string, type: ActivityBody) => Promise<FetchResult<Activity> | undefined>;
  edit: Activity | undefined;
}

export default function ActivityForm({
  open,
  handleClose,
  handleCreate,
  handleUpdate,
  edit
}: ActivityFormProps) {
  const { data } = useQuery(GET_USER_TYPES);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset
  } = useForm({ mode: 'onChange', resolver: yupResolver(activitySchema) });

  const onClose = () => {
    reset();
    handleClose();
  };

  const onSubmit = async ({
    date,
    time,
    status,
    type,
    goalDistance,
    distance,
    goalDuration,
    duration
  }: FormValues) => {
    const formatedDate = format(new Date(date), 'yyyy-MM-dd');
    const formatedTime = format(new Date(time), 'HH:mm');
    const newActivity = {
      datetime: new Date(`${formatedDate}T${formatedTime}`),
      status,
      typeId: type,
      goalDistance,
      distance,
      goalDuration: goalDuration && format(goalDuration, 'HH:mm:ss'),
      duration: duration && format(duration, 'HH:mm:ss')
    };
    const response = edit
      ? await handleUpdate(edit.id, newActivity)
      : await handleCreate(newActivity);

    if (response && response.data) onClose();
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography
            id="add-activity-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: 'center' }}>
            {edit ? 'Edit Activity' : 'Add Activity'}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DateTimePicker
                  control={control}
                  name="date"
                  label="Date"
                  type="date"
                  defaultValue={edit?.datetime}
                />
              </Grid>
              <Grid item xs={6}>
                <DateTimePicker
                  control={control}
                  name="time"
                  label="Time"
                  type="time"
                  defaultValue={edit?.datetime}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  options={
                    data?.listTypes.map((type: Type) => ({ key: type.type, value: type.id })) || []
                  }
                  label="Type"
                  name="type"
                  register={register}
                  errors={errors}
                  defaultValue={
                    edit?.type && {
                      key: edit.type.type,
                      value: edit.type.id
                    }
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  options={status}
                  label="Status"
                  name="status"
                  register={register}
                  errors={errors}
                  defaultValue={edit && { key: edit.status, value: edit.status }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="goalDistance"
                  label="Goal Distance"
                  defaultValue={edit?.goalDistance}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">km</InputAdornment>
                  }}
                  {...register('goalDistance')}
                  error={!!errors.goalDistance}
                  helperText={errors.goalDistance && (errors.goalDistance.message as string)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="distance"
                  label="Distance"
                  defaultValue={edit?.distance}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">km</InputAdornment>
                  }}
                  {...register('distance')}
                  error={!!errors.distance}
                  helperText={errors.distance && (errors.distance.message as string)}
                />
              </Grid>
              <Grid item xs={6}>
                <TimeField
                  control={control}
                  name="goalDuration"
                  label="Goal Duration"
                  defaultValue={edit && new Date('2012-12-12T' + edit.goalDuration)}
                />
              </Grid>
              <Grid item xs={6}>
                <TimeField
                  control={control}
                  name="duration"
                  label="Duration"
                  defaultValue={edit && new Date('2012-12-12T' + edit.duration)}
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
