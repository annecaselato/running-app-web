import { render, screen, fireEvent } from '@testing-library/react';
import CrudGrid from './CrudGrid';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' }
];

const rows = [
  { id: 1, name: 'User One' },
  { id: 2, name: 'User Two' }
];

const handleAddMock = jest.fn();
const handleEditMock = jest.fn();
const handleDeleteMock = jest.fn();

const renderGrid = () => {
  render(
    <CrudGrid
      rows={rows}
      columns={columns}
      handleAdd={handleAddMock}
      handleEdit={handleEditMock}
      handleDelete={handleDeleteMock}
    />
  );
};

describe('CrudGrid', () => {
  it('renders without errors', () => {
    renderGrid();

    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });

  it('should call handleAdd when Add New button is clicked', () => {
    renderGrid();

    fireEvent.click(screen.getByText('Add New'));
    expect(handleAddMock).toHaveBeenCalled();
  });

  it('should call handleEdit when Edit button is clicked', () => {
    renderGrid();

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Edit Row' })[0]);
    expect(handleEditMock).toHaveBeenCalled();
  });

  it('should call handleDelete when Delete button is clicked', () => {
    renderGrid();

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Delete Row' })[0]);
    expect(handleDeleteMock).toHaveBeenCalled();
  });
});
