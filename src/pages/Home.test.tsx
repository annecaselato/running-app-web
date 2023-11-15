import { render, waitFor, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Home, { GET_WEEK_ACTIVITIES } from './Home';
import { GET_USER_TYPES } from './Types';
import { UPDATE_ACTIVITY } from './Activity';

const mockGet = {
  request: {
    query: GET_WEEK_ACTIVITIES,
    variables: {
      startAt: new Date('2021-03-10')
    }
  },
  result: {
    data: {
      listWeekActivities: [
        {
          day: '3/10/2021',
          activities: [
            {
              id: 'activity-1-id',
              type: 'Run',
              status: 'Completed',
              datetime: new Date('2021-03-10T00:26:00.000Z'),
              goalDistance: 10.0,
              distance: 12.5,
              goalDuration: '01:00:00',
              duration: '01:40:00'
            }
          ]
        },
        {
          day: '3/11/2021',
          activities: []
        },
        {
          day: '3/12/2021',
          activities: [
            {
              id: 'activity-2-id',
              type: 'Walk',
              status: 'Planned',
              datetime: new Date('2021-03-12T00:26:00.000Z'),
              goalDistance: 5.0,
              distance: null,
              goalDuration: null,
              duration: null
            }
          ]
        }
      ]
    }
  }
};

const mockGetTypes = {
  request: {
    query: GET_USER_TYPES
  },
  result: {
    data: {
      listTypes: [
        {
          id: 'type-1-id',
          type: 'Run',
          description: 'Regular run'
        },
        {
          id: 'type-2-id',
          type: 'Walk',
          description: 'Regular walk'
        }
      ]
    }
  }
};

const updateRequest = {
  query: UPDATE_ACTIVITY,
  variables: {
    id: 'activity-1-id',
    datetime: new Date('2021-03-10T00:26:00.000Z'),
    status: 'Completed',
    type: 'Run',
    goalDistance: 10,
    distance: 12.5,
    goalDuration: '01:00:00',
    duration: '01:40:00'
  }
};

const updateMock = {
  request: updateRequest,
  result: {
    data: {
      updateActivity: {
        id: 'activity-1-id'
      }
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any) => {
  render(
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Home />
          </MockedProvider>
        </MemoryRouter>
      </LocalizationProvider>
      <ToastContainer />
    </>
  );
};

describe('Home', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-03-10'));
  });

  it('renders home page with data', async () => {
    renderPage([mockGet, mockGetTypes]);

    await waitFor(() => {
      expect(screen.getByText('Week Schedule')).toBeInTheDocument();
      expect(screen.getByText('Wednesday, Mar 10')).toBeInTheDocument();
      expect(screen.getByText('Run')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('opens the activity form modal when "Add New" is clicked', async () => {
    renderPage([mockGet, mockGetTypes]);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Add New')[0]);
      expect(screen.getByText('Add Activity')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });
  });

  it('opens the activity form modal when "Edit" is clicked', async () => {
    renderPage([mockGet, mockGetTypes, updateMock, updateMock, mockGet]);

    await waitFor(() => {
      fireEvent.click(screen.getAllByTestId('EditIcon')[0]);

      expect(screen.getByText('Edit Activity')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Save'));
    });
  });
});
