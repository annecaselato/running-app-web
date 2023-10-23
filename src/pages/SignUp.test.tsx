import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SignUp, { CREATE_USER } from './SignUp';
import { ApolloError } from '@apollo/client';
import { SIGN_IN } from './SignIn';
import { MemoryRouter } from 'react-router-dom';
import { GraphQLError } from 'graphql';
import { ToastContainer } from 'react-toastify';

const mocks = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        name: 'Test User',
        email: 'user@example.com',
        password: 'Pass123!'
      }
    },
    result: {
      data: {
        createUser: {
          id: 'user-id',
          name: 'Test User',
          email: 'user@example.com'
        }
      }
    }
  },
  {
    request: {
      query: SIGN_IN,
      variables: {
        email: 'user@example.com',
        password: 'Pass123!'
      }
    },
    result: {
      data: {
        signIn: {
          access_token: 'access-token',
          user: {
            id: 'user-id',
            email: 'user@example.com',
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
      graphQLErrors: [{ message: 'API error' } as GraphQLError],
      networkError: null
    })
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderSignUp = (mock: any) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mock} addTypename={false}>
          <SignUp />
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

describe('Sign Up', () => {
  it('renders SignUp component and submits form', async () => {
    renderSignUp(mocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'Pass123!' } });
      fireEvent.click(screen.getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/sign-up/profile', { replace: true });
    });
  });

  it('handles API error', async () => {
    renderSignUp(errorMocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'Pass123!' } });
      fireEvent.click(screen.getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  it('handles form error', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignUp />
      </MockedProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@' } });
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Must be a valid email')).toBeInTheDocument();
    });
  });
});
