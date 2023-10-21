import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TypeForm, { Type } from './TypeForm';

const handleCloseMock = jest.fn();
const handleCreateMock = jest.fn();
const handleUpdateMock = jest.fn();

const renderForm = (edit?: Type) => {
  render(
    <MemoryRouter>
      <TypeForm
        open={true}
        handleClose={handleCloseMock}
        handleCreate={handleCreateMock}
        handleUpdate={handleUpdateMock}
        edit={edit}
      />
    </MemoryRouter>
  );
};

describe('TypeForm', () => {
  beforeEach(() => {
    handleCreateMock.mockResolvedValue({
      data: { createType: { id: '1', type: 'New Type', description: 'New type description.' } }
    });

    handleUpdateMock.mockResolvedValue({
      data: { updateType: { id: '1', type: 'New Type', description: 'New type description.' } }
    });
  });

  it('handles creation of types correctly', async () => {
    renderForm();

    expect(screen.getByText('Add Type')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'New Type' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New type description.' }
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleCreateMock).toHaveBeenCalledWith({
        type: 'New Type',
        description: 'New type description.'
      });

      expect(handleCloseMock).toHaveBeenCalled();
    });
  });

  it('handles update of types correctly', async () => {
    renderForm({ id: '1', type: 'Activity Type', description: 'Type description' });

    expect(screen.getByText('Edit Type')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'New Type' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New type description.' }
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleUpdateMock).toHaveBeenCalledWith('1', {
        type: 'New Type',
        description: 'New type description.'
      });

      expect(handleCloseMock).toHaveBeenCalled();
    });
  });
});
