import { fireEvent, render, screen } from '@testing-library/react';
import DayScheduleCard from './DayScheduleCard';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Activity } from '../forms/ActivityForm';

const mockData = {
  day: '11/12/2023',
  activities: [
    {
      id: '1',
      datetime: new Date('2023-11-12T10:00:00'),
      type: 'Running',
      status: 'Completed',
      goalDistance: 5,
      distance: 5,
      goalDuration: '1 hour',
      duration: '45 minutes'
    }
  ]
};

const mockHandleAdd = jest.fn();
const mockHandleEdit = jest.fn();
const mockIsToday = true;

const renderComponent = (data: { day: string; activities: Activity[] }) => {
  render(
    <>
      <MemoryRouter>
        <DayScheduleCard
          data={data}
          handleAdd={mockHandleAdd}
          handleEdit={mockHandleEdit}
          isToday={mockIsToday}
        />
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

describe('DayScheduleCard', () => {
  it('renders date and activities correctly', () => {
    renderComponent(mockData);

    expect(screen.getByText('Sunday, Nov 12')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Goal Distance: 5 km')).toBeInTheDocument();
    expect(screen.getByText('Distance: 5 km')).toBeInTheDocument();
    expect(screen.getByText('Goal Duration: 1 hour')).toBeInTheDocument();
    expect(screen.getByText('Duration: 45 minutes')).toBeInTheDocument();
  });

  it('calls handleAdd when "Add New" button is clicked', () => {
    renderComponent(mockData);

    fireEvent.click(screen.getByText('Add New'));

    expect(mockHandleAdd).toHaveBeenCalledWith(new Date(mockData.day));
  });

  it('calls handleEdit when "Edit" button is clicked', () => {
    renderComponent(mockData);

    fireEvent.click(screen.getByTestId('EditIcon'));

    expect(mockHandleEdit).toHaveBeenCalledWith(mockData.activities[0]);
  });

  it('displays message when there is no activity', () => {
    renderComponent({ ...mockData, activities: [] });

    expect(screen.getByText("You don't have any activities on this day yet")).toBeInTheDocument();
  });
});
