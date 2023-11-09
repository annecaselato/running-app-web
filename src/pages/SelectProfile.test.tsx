import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ToastContainer } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import SelectProfile, { UPDATE_PROFILE } from './SelectProfile';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const mocks = [
  {
    request: {
      query: UPDATE_PROFILE,
      variables: {
        profile: 'Athlete'
      }
    },
    result: {
      data: {
        updateProfile: {
          id: 'user-id',
          name: 'Test User',
          profile: 'Athlete',
          email: 'user@example.com'
        }
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: UPDATE_PROFILE,
      variables: {
        profile: 'Coach'
      }
    },
    result: undefined,
    error: new ApolloError({
      errorMessage: 'API error',
      graphQLErrors: [{ message: 'API error' } as GraphQLError],
      networkError: null
    })
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mock: any) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mock} addTypename={false}>
          <SelectProfile />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

describe('SelectProfile', () => {
  it('renders SelectProfile and updates profile on card click', async () => {
    renderPage(mocks);

    expect(screen.getByText('Choose Your Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Customize your experience by selecting a profile:')
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText('Athlete'));
    });

    await waitFor(() => {
      expect(localStorage.getItem('user')).not.toBeNull();
    });

    localStorage.removeItem('user');
  });

  it('handles API error response', async () => {
    renderPage(errorMocks);

    expect(screen.getByText('Choose Your Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Customize your experience by selecting a profile:')
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Coach'));
    });

    await waitFor(() => {
      expect(screen.getByText('Update failed. Please try again.')).toBeInTheDocument();
    });
  });
});
