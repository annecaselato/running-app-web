import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface PasswordInputProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function PasswordInput({ label, name, register, errors }: PasswordInputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prevState) => !prevState);

  const { message: errorMessage } = errors[name] || {};

  return (
    <FormControl fullWidth error={!!errorMessage} variant="outlined">
      <InputLabel htmlFor={name}>{label + ' *'}</InputLabel>
      <OutlinedInput
        id={name as string}
        type={isPasswordVisible ? 'text' : 'password'}
        required
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={togglePasswordVisibility}
              edge="end">
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        {...register(name)}
      />
      <FormHelperText sx={{ whiteSpace: 'pre-wrap' }}>{errorMessage as string}</FormHelperText>
    </FormControl>
  );
}
