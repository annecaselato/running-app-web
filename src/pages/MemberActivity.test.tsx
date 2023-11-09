import { render, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MemberActivity from './MemberActivity';
import { GET_USER_ACTIVITIES } from './Activity';
import { GET_USER_TYPES } from './Types';

const mockGet = {
  request: {
    query: GET_USER_ACTIVITIES,
    variables: { memberId: 'your-member-id' }
  },
  result: {
    data: {
      listActivities: {
        name: 'User',
        rows: [
          {
            id: 'activity-1-id',
            type: 'Run',
            status: 'Completed',
            datetime: new Date().toISOString(),
            goalDistance: 10.0,
            distance: 12.5,
            goalDuration: '01:00:00',
            duration: '01:40:00'
          },
          {
            id: 'activity-2-id',
            type: 'Walk',
            status: 'Planned',
            datetime: new Date().toISOString(),
            goalDistance: 10.0,
            distance: null,
            goalDuration: '01:00:00',
            duration: null
          }
        ]
      }
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'your-member-id'
  }),
  useRouteMatch: () => ({ url: '/activity/your-member-id' }),
  useNavigate: () => mockNavigate
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any) => {
  render(
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemberActivity />
          </MockedProvider>
        </MemoryRouter>
      </LocalizationProvider>
      <ToastContainer />
    </>
  );
};

describe('MemberActivity', () => {
  it('renders the page with member activities', async () => {
    localStorage.setItem('user', JSON.stringify({ profile: 'COACH' }));

    renderPage([mockGet, mockGetTypes]);

    await waitFor(() => {
      expect(screen.getByText('Activity: User')).toBeInTheDocument();
      expect(screen.getByText('Run')).toBeInTheDocument();
      expect(screen.getByText('Walk')).toBeInTheDocument();
    });
  });
});
