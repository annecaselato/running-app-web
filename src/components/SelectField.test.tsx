import { act, render, screen, waitFor } from '@testing-library/react';
import SelectField from './SelectField';
import userEvent from '@testing-library/user-event';

const options = ['Option 1', 'Option 2', 'Option 3'];

const renderSelect = () =>
  render(
    <SelectField
      options={options}
      label="Select an option"
      name="selectField"
      register={jest.fn()}
      errors={{}}
    />
  );

describe('SelectField', () => {
  it('renders select field with default option', async () => {
    renderSelect();

    await waitFor(() => {
      expect(screen.getByLabelText('Select an option')).toBeInTheDocument();
    });
  });

  it('updates the selected option when changed', () => {
    renderSelect();

    act(() => {
      userEvent.click(screen.getByText('Option 1'));
    });

    act(() => {
      userEvent.click(screen.getByText('Option 2'));
    });

    expect((screen.getAllByText('Option 2')[1] as HTMLOptionElement).selected).toBeTruthy();
    expect((screen.getByText('Option 1') as HTMLOptionElement).selected).toBeFalsy();
  });

  it('displays error message when there are errors', () => {
    render(
      <SelectField
        options={options}
        label="Select an option"
        name="selectField"
        register={jest.fn()}
        errors={{ selectField: { type: 'manual', message: 'Required field' } }}
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});
