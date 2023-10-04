import { MenuItem, TextField } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface SelectFieldProps {
  options: string[];
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function SelectField({ options, label, name, register, errors }: SelectFieldProps) {
  return (
    <TextField
      select
      fullWidth
      defaultValue={options[0]}
      id={name}
      label={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name] && (errors[name]?.message as string)}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
