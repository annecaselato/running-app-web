import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TeamForm, { Team } from './TeamForm';

const handleCloseMock = jest.fn();
const handleCreateMock = jest.fn();
const handleUpdateMock = jest.fn();

const renderForm = (edit?: Team) => {
  render(
    <MemoryRouter>
      <TeamForm
        open={true}
        handleClose={handleCloseMock}
        handleCreate={handleCreateMock}
        handleUpdate={handleUpdateMock}
        edit={edit}
      />
    </MemoryRouter>
  );
};

describe('TeamForm', () => {
  beforeEach(() => {
    handleCreateMock.mockResolvedValue({
      data: { createTeam: { id: '1' } }
    });

    handleUpdateMock.mockResolvedValue({
      data: { updateTeam: { id: '1' } }
    });
  });

  it('handles team creation correctly', async () => {
    renderForm();

    expect(screen.getByText('Add Team')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Team' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New team description.' }
    });
    fireEvent.click(screen.getByText('Add Member'));
    fireEvent.click(screen.getByText('Add Member'));
    fireEvent.change(screen.getAllByLabelText('Email')[0], {
      target: { value: 'newmember@example.com' }
    });
    fireEvent.change(screen.getAllByLabelText('Email')[1], {
      target: { value: 'newmember@example.com' }
    });
    fireEvent.click(screen.getAllByText('Remove')[0]);
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleCreateMock).toHaveBeenCalledWith({
        name: 'New Team',
        description: 'New team description.',
        members: ['newmember@example.com']
      });

      expect(handleCloseMock).toHaveBeenCalled();
    });
  });

  it('handles team update correctly', async () => {
    renderForm({ id: '1', name: 'Test Team', description: 'Team description', members: [] });

    expect(screen.getByText('Edit Team')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Team' } });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New team description.' }
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleUpdateMock).toHaveBeenCalledWith('1', {
        name: 'New Team',
        description: 'New team description.'
      });

      expect(handleCloseMock).toHaveBeenCalled();
    });
  });
});
