import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordInput from './PasswordInput';

describe('PasswordInput', () => {
  const mockRegister = jest.fn();
  const mockErrors = {};

  it('renders label and toggles password visibility', () => {
    render(
      <PasswordInput label="Password" name="password" register={mockRegister} errors={mockErrors} />
    );

    expect(screen.getByLabelText('Password *')).toBeInTheDocument();

    const inputElement = screen.getByLabelText('Password *');
    const toggleButton = screen.getByLabelText('toggle password visibility');

    expect(inputElement).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('displays error message when there are errors', () => {
    const mockCustomErrors = { password: { type: 'manual', message: 'Password is required' } };

    render(
      <PasswordInput
        label="Password"
        name="password"
        register={mockRegister}
        errors={mockCustomErrors}
      />
    );

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
