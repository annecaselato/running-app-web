import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MemberForm from './MemberForm';

const handleCloseMock = jest.fn();
const handleCreateMock = jest.fn();

const renderForm = () => {
  render(
    <MemoryRouter>
      <MemberForm open={true} handleClose={handleCloseMock} handleCreate={handleCreateMock} />
    </MemoryRouter>
  );
};

describe('MemberForm', () => {
  beforeEach(() => {
    handleCreateMock.mockResolvedValue({
      data: { createMembers: { id: '1' } }
    });
  });

  it('handles members creation correctly', async () => {
    renderForm();

    expect(screen.getByText('Add Members')).toBeInTheDocument();

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
      expect(handleCreateMock).toHaveBeenCalledWith(['newmember@example.com']);

      expect(handleCloseMock).toHaveBeenCalled();
    });
  });
});
