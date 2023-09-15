import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SignIn, { SIGN_IN, SIGN_IN_OIDC } from './SignIn';
import { act } from 'react-dom/test-utils';
import { ApolloError } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLError } from 'graphql';
import { ToastContainer } from 'react-toastify';

const mocks = [
  {
    request: {
      query: SIGN_IN,
      variables: {
        email: 'user@example.com',
        password: 'password123'
      }
    },
    result: {
      data: {
        signIn: {
          access_token: 'access-token',
          user: {
            id: 'user-id',
            name: 'Test User'
          }
        }
      }
    }
  },
  {
    request: {
      query: SIGN_IN_OIDC,
      variables: {
        token: 'id-token'
      }
    },
    result: {
      data: {
        signInOIDC: {
          access_token: 'access-token',
          user: {
            id: 'user-id',
            name: 'Test User'
          }
        }
      }
    }
  }
];

const errorMocks = [
  {
    ...mocks[0],
    result: undefined,
    error: new ApolloError({
      errorMessage: 'API error',
      graphQLErrors: [{ message: 'API error' } as GraphQLError],
      networkError: null
    })
  },
  {
    ...mocks[1],
    result: undefined,
    error: new ApolloError({
      errorMessage: 'API error',
      graphQLErrors: [{ message: 'API error' } as GraphQLError],
      networkError: null
    })
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderSignIn = (mock: any) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mock} addTypename={false}>
          <SignIn />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

let mockGoogleError = false;
jest.mock('@react-oauth/google', () => ({
  ...jest.requireActual('@react-oauth/google'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GoogleLogin: ({ onSuccess, onError }: any) => (
    <button onClick={() => (mockGoogleError ? onError() : onSuccess({ credential: 'id-token' }))}>
      Sign in with Google
    </button>
  )
}));

describe('Sign In', () => {
  it('renders SignIn component and submits form', async () => {
    renderSignIn(mocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Password *'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/', { replace: true });
    });
  });

  it('handles API error', async () => {
    renderSignIn(errorMocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Password *'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(screen.getByText('Sign in failed: API error')).toBeInTheDocument();
    });
  });

  it('handles form error', async () => {
    renderSignIn(mocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'user@' }
      });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: '' } });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(screen.getByText('email must be a valid email')).toBeInTheDocument();
      expect(screen.getByText('password is a required field')).toBeInTheDocument();
    });
  });

  it('handles Google Sign-In', async () => {
    mockGoogleError = false;
    renderSignIn(mocks);

    await act(async () => {
      fireEvent.click(screen.getByText('Sign in with Google'));
    });

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/', { replace: true });
    });
  });

  it('handles Google Sign-In error', async () => {
    mockGoogleError = true;
    renderSignIn(mocks);

    await act(async () => {
      fireEvent.click(screen.getByText('Sign in with Google'));
    });

    await waitFor(() => {
      expect(screen.getByText('Sign in failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles Google Sign-In API error', async () => {
    mockGoogleError = false;
    renderSignIn(errorMocks);

    await act(async () => {
      fireEvent.click(screen.getByText('Sign in with Google'));
    });

    await waitFor(() => {
      expect(screen.getByText('Sign in failed. Please try again.')).toBeInTheDocument();
    });
  });
});
