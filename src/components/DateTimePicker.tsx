import { Control, Controller } from 'react-hook-form';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

interface DateTimePickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  type: 'date' | 'time';
}

export default function DateTimePicker({ control, name, label, type }: DateTimePickerProps) {
  const PickerComponent = type === 'time' ? TimePicker : DatePicker;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      defaultValue={new Date()}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <PickerComponent
          label={label}
          format={type === 'time' ? 'HH:mm' : 'dd/MM/yyyy'}
          value={new Date(value)}
          onChange={(event) => {
            onChange(event);
          }}
          slotProps={{
            textField: {
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
