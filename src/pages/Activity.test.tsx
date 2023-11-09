import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Activity, { GET_USER_ACTIVITIES } from './Activity';
import { GET_USER_TYPES } from './Types';

const mocks = [
  {
    request: {
      query: GET_USER_ACTIVITIES
    },
    result: {
      data: {
        listActivities: {
          name: 'User',
          rows: [
            {
              id: '1',
              datetime: '2023-10-21T09:00:00Z',
              status: 'Completed',
              type: {
                id: '2',
                type: 'Running'
              },
              goalDistance: 10.0,
              distance: 12.5,
              goalDuration: '01:00:00',
              duration: '01:40:00'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_USER_TYPES
    },
    result: {
      data: {
        listTypes: [
          {
            id: '1',
            type: 'Type 1',
            description: 'Description 1'
          }
        ]
      }
    }
  }
];

describe('Activity', () => {
  it('renders the Activity page and displays data', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Activity />
        </MockedProvider>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText('21/10/2023')).toBeInTheDocument();
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('10.0')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
      expect(screen.getByText('1:30:00')).toBeInTheDocument();
      expect(screen.getByText('1:40:00')).toBeInTheDocument();
    });
  });
});
