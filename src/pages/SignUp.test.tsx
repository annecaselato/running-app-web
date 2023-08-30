import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SignUp, { CREATE_USER } from './SignUp';
import { act } from 'react-dom/test-utils';
import { ApolloError } from '@apollo/client';
import { SIGN_IN } from './SignIn';
import { MemoryRouter } from 'react-router-dom';

const mocks = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }
    },
    result: {
      data: {
        createUser: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    }
  },
  {
    request: {
      query: SIGN_IN,
      variables: {
        email: 'john@example.com',
        password: 'password123'
      }
    },
    result: {
      data: {
        signIn: {
          access_token: 'access-token',
          user: {
            id: 'user-id',
            name: 'John Doe'
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
      networkError: null
    })
  }
];

describe('Sign Up', () => {
  it('renders SignUp component and submits form', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SignUp />
        </MockedProvider>
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign Up'));
    });
  });

  it('renders SignUp component and handles API error', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <SignUp />
        </MockedProvider>
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
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
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(screen.getByText('name is a required field')).toBeInTheDocument();
      expect(screen.getByText('email must be a valid email')).toBeInTheDocument();
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
  });
});
