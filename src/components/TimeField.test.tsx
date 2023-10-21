import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import TimeField from './TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function TestComponent() {
  const formMethods = useForm();

  return (
    <FormProvider {...formMethods}>
      <TimeField control={formMethods.control} name="time" label="Time" />
    </FormProvider>
  );
}

describe('TimeField', () => {
  it('renders the TimeField component', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TestComponent />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  it('updates the time value when changed', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TestComponent />
      </LocalizationProvider>
    );

    act(() => {
      userEvent.type(screen.getByRole('textbox', { name: 'Time' }), '05:30:00');
    });

    expect(screen.getByDisplayValue('05:30:00')).toBeInTheDocument();
  });
});
