import { MenuItem, TextField } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface SelectFieldProps {
  options: { key: string; value: string }[];
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  defaultValue?: { key: string; value: string };
}

export default function SelectField({
  options,
  label,
  name,
  register,
  errors,
  defaultValue
}: SelectFieldProps) {
  return (
    <TextField
      select
      fullWidth
      defaultValue={defaultValue?.value || options[0]?.value}
      id={name}
      label={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name] && (errors[name]?.message as string)}>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.value}>
          {option.key}
        </MenuItem>
      ))}
    </TextField>
  );
}
