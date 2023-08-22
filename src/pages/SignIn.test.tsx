import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SignIn, { SIGN_IN } from './SignIn';
import { act } from 'react-dom/test-utils';
import { ApolloError } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';

const mocks = [
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
    request: {
      query: SIGN_IN,
      variables: {
        email: 'john@example.com',
        password: 'password123'
      }
    },
    error: new ApolloError({ errorMessage: 'Error from API' })
  }
];

describe('Sign In', () => {
  test('renders SignIn component and submits form', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SignIn />
        </MockedProvider>
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));
    });
  });

  test('renders SignIn component and handles API error', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <SignIn />
      </MockedProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(screen.getByText('Error from API')).toBeInTheDocument();
    });
  });

  test('handles form error', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <SignIn />
      </MockedProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '' } });
      fireEvent.click(screen.getByText('Sign In'));
    });

    await waitFor(() => {
      expect(screen.getByText('email must be a valid email')).toBeInTheDocument();
      expect(screen.getByText('password is a required field')).toBeInTheDocument();
    });
  });
});
