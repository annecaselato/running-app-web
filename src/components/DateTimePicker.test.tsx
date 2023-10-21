import { act, render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import DateTimePicker from './DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';

function TestComponent() {
  const formMethods = useForm();

  return (
    <FormProvider {...formMethods}>
      <DateTimePicker control={formMethods.control} name="date" label="Date" type="date" />
      <DateTimePicker control={formMethods.control} name="time" label="Time" type="time" />
      <div data-testid="form-values">
        <p>Date: {formMethods.getValues('date')}</p>
        <p>Time: {formMethods.getValues('time')}</p>
      </div>
      <button type="submit">Submit</button>
    </FormProvider>
  );
}

describe('DateTimePicker', () => {
  beforeAll(() => {
    // this is necessary for the date picker to be rendered in desktop mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (query: any) => ({
        media: query,
        matches: query === '(pointer: fine)',
        onchange: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: () => false
      })
    });
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.matchMedia;
  });

  it('renders date and time pickers', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TestComponent />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  it('updates the date and time values when changed', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TestComponent />
      </LocalizationProvider>
    );

    const date = screen.getByLabelText('Date');
    const time = screen.getByLabelText('Time');

    act(() => {
      userEvent.type(date, format(new Date('2023-05-05T14:00:00'), 'dd/MM/yyyy'));
      userEvent.type(time, format(new Date('2023-05-05T09:45:00'), 'HH:mm'));
    });

    expect(date).toHaveValue('05/05/2023');
    expect(time).toHaveValue('09:45');
  });
});
