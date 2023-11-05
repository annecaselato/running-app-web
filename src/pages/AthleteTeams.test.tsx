import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AthleteTeams, { ACCEPT_INVITATION, GET_ATHLETE_TEAMS } from './AthleteTeams';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const mockListTeams = {
  request: {
    query: GET_ATHLETE_TEAMS
  },
  result: {
    data: {
      listAthleteTeams: {
        invitations: [
          {
            id: '1',
            team: {
              id: 'team1',
              name: 'Team 1',
              description: 'Description 1',
              coach: {
                id: 'coach1',
                name: 'Coach 1'
              }
            }
          }
        ],
        teams: [
          {
            id: '2',
            acceptedAt: '2023-11-05T00:00:00.000Z',
            team: {
              id: 'team2',
              name: 'Team 2',
              coach: {
                id: 'coach2',
                name: 'Coach 2'
              }
            }
          }
        ]
      }
    }
  }
};

const mockAccept = {
  request: {
    query: ACCEPT_INVITATION,
    variables: { id: 'member-1-id' }
  },
  result: {
    data: {
      acceptInvitation: 'member-1-id'
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mock: any[]) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mock}>
          <AthleteTeams />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

describe('AthleteTeams', () => {
  it('renders invitations and teams', async () => {
    renderPage([mockListTeams]);

    await waitFor(() => {
      expect(screen.getByText('Invitations')).toBeInTheDocument();
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Coach 1')).toBeInTheDocument();
      expect(screen.getByText('Team 2')).toBeInTheDocument();
      expect(screen.getByText('Coach 2')).toBeInTheDocument();
    });
  });

  it('handles invitation acceptance and deletion', async () => {
    renderPage([mockListTeams, mockAccept]);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('CheckIcon'));
    });
  });
});
