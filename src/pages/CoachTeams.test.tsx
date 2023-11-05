import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import CoachTeams, { GET_COACH_TEAMS } from './CoachTeams';

const mocks = [
  {
    request: {
      query: GET_COACH_TEAMS
    },
    result: {
      data: {
        listCoachTeams: [
          {
            id: '1',
            name: 'Team 1',
            description: 'Description 1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            name: 'Team 2',
            description: 'Description 2',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    }
  }
];

describe('Teams', () => {
  it('renders the Teams page and displays data', async () => {
    localStorage.setItem('user', '{"id":"user-id","profile":"Coach"}');

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CoachTeams />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Team 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });
});
