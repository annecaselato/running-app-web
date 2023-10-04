import { fireEvent, render, screen, within } from '@testing-library/react';
import SelectField from './SelectField';

const renderSelect = () =>
  render(
    <SelectField
      options={['Option 1', 'Option 2', 'Option 3']}
      label="Select an option"
      name="selectField"
      register={jest.fn()}
      errors={{}}
    />
  );

describe('SelectField', () => {
  it('renders select field with default option', async () => {
    renderSelect();

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  it('updates the selected option when changed', async () => {
    renderSelect();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Select an option Option 1' }));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('Option 2'));

    expect(screen.getByRole('button', { name: 'Select an option Option 2' })).toBeInTheDocument();
  });

  it('displays error message when there are errors', () => {
    render(
      <SelectField
        options={['Option 1', 'Option 2', 'Option 3']}
        label="Select an option"
        name="selectField"
        register={jest.fn()}
        errors={{ selectField: { type: 'manual', message: 'Required field' } }}
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});
