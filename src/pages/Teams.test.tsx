import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Teams from './Teams';
import { GET_ATHLETE_TEAMS } from './AthleteTeams';
import { GET_COACH_TEAMS } from './CoachTeams';

const mockAthleteTeams = {
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

const mockCoachTeams = {
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
};

describe('Teams', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPage = (mocks: any[]) => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Teams />
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders CoachTeams for a coach user', () => {
    localStorage.setItem('user', JSON.stringify({ profile: 'COACH' }));

    renderPage([mockCoachTeams, mockAthleteTeams]);

    waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
  });

  it('renders AthleteTeams for an athlete user', () => {
    localStorage.setItem('user', JSON.stringify({ profile: 'ATHLETE' }));

    renderPage([mockAthleteTeams]);

    waitFor(() => {
      expect(screen.getByText('Invitations')).toBeInTheDocument();
    });
  });
});
