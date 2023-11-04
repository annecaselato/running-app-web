import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TeamMembers, { CREATE_MEMBER, DELETE_MEMBER, GET_TEAM } from './TeamMembers';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const mockGet = {
  request: {
    query: GET_TEAM,
    variables: { id: 'your-team-id' }
  },
  result: {
    data: {
      getTeam: {
        id: 'your-team-id',
        name: 'Your Team Name',
        members: [
          {
            id: 'member-1-id',
            email: 'member1@example.com',
            acceptedAt: null,
            createdAt: '2023-11-04T12:00:00Z',
            user: null
          },
          {
            id: 'member-2-id',
            email: 'member2@example.com',
            acceptedAt: '2023-12-04T12:00:00Z',
            createdAt: '2023-11-04T12:00:00Z',
            user: {
              id: 'user-2-id',
              name: 'Member 2'
            }
          }
        ]
      }
    }
  }
};

const mockCreate = {
  request: {
    query: CREATE_MEMBER,
    variables: { id: 'your-team-id', members: ['new-member@example.com'] }
  },
  result: {
    data: {
      createMembers: {
        id: 'your-team-id'
      }
    }
  }
};

const mockCreateError = {
  request: {
    query: CREATE_MEMBER,
    variables: { id: 'your-team-id', members: ['new-member@example.com'] }
  },
  result: undefined,
  error: new ApolloError({
    errorMessage: 'API error',
    graphQLErrors: [{ message: 'API error' } as GraphQLError],
    networkError: null
  })
};

const mockDelete = {
  request: {
    query: DELETE_MEMBER,
    variables: { id: 'member-1-id' }
  },
  result: {
    data: {
      deleteMember: 'member-1-id'
    }
  }
};

const mockDeleteError = {
  request: {
    query: DELETE_MEMBER,
    variables: { id: 'member-1-id' }
  },
  result: undefined,
  error: new ApolloError({
    errorMessage: 'API error',
    graphQLErrors: [{ message: 'API error' } as GraphQLError],
    networkError: null
  })
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any[]) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <TeamMembers />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'your-team-id'
  }),
  useRouteMatch: () => ({ url: '/teams/your-team-id' }),
  useNavigate: () => mockNavigate
}));

describe('TeamMembers', () => {
  it('renders the page with data', async () => {
    renderPage([mockGet]);

    await waitFor(() => {
      expect(screen.getByText('Team: Your Team Name')).toBeInTheDocument();
    });
  });

  it('adds a new member', async () => {
    renderPage([mockGet, mockCreate]);

    fireEvent.click(screen.getByText('Add New'));
    fireEvent.click(screen.getByText('Add Member'));
    fireEvent.change(screen.getAllByLabelText('Email')[0], {
      target: { value: 'new-member@example.com' }
    });
    fireEvent.click(screen.getByText('Save'));
  });

  it('handles create error', async () => {
    renderPage([mockGet, mockCreateError]);

    fireEvent.click(screen.getByText('Add New'));
    fireEvent.click(screen.getByText('Add Member'));
    fireEvent.change(screen.getAllByLabelText('Email')[0], {
      target: { value: 'new-member@example.com' }
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  it('deletes a member', async () => {
    renderPage([mockGet, mockDelete]);

    await waitFor(() => {
      expect(screen.getByText('member1@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Delete Row' })[0]);
  });

  it('handles delete error', async () => {
    renderPage([mockGet, mockDeleteError]);

    await waitFor(() => {
      expect(screen.getByText('member1@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Delete Row' })[0]);

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  it('handles back to teams navigation', async () => {
    renderPage([mockGet]);

    fireEvent.click(screen.getByText('Back to teams'));

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/teams', { replace: true });
    });
  });

  it('handles member details navigation', async () => {
    renderPage([mockGet]);

    await waitFor(() => {
      expect(screen.getByText('member1@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'See Row Details' })[0]);

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/activity/member-1-id', { replace: true });
    });
  });
});
