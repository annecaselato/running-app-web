import { Control, Controller } from 'react-hook-form';
import { TimeField as MuiTimeField } from '@mui/x-date-pickers';

interface TimeFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
}

export default function TimeField({ control, name, label }: TimeFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <MuiTimeField
          label={label}
          format="HH:mm:ss"
          value={value && new Date(value)}
          onChange={(event) => {
            onChange(event);
          }}
          slotProps={{
            textField: {
              id: name,
              fullWidth: true,
              error: !!error,
              helperText: error?.message
            }
          }}
        />
      )}
    />
  );
}
