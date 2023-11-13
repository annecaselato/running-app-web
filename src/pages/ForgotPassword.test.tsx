import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastContainer } from 'react-toastify';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import ForgotPassword, { REQUEST_RECOVERY } from './ForgotPassword';

const request = {
  query: REQUEST_RECOVERY,
  variables: { email: 'test@example.com' }
};

const recoveryMock = {
  request,
  result: {
    data: {
      requestRecovery: true
    }
  }
};

const errorMock = {
  request,
  result: undefined,
  error: new ApolloError({
    errorMessage: 'API error',
    graphQLErrors: [{ message: 'API error' } as GraphQLError],
    networkError: null
  })
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any[]) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ForgotPassword />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

describe('ForgotPassword', () => {
  test('renders page', () => {
    renderPage([recoveryMock]);

    expect(screen.getByRole('heading', { name: 'Password Recovery' })).toBeInTheDocument();
  });

  test('submits form and handles success', async () => {
    renderPage([recoveryMock]);

    act(() => {
      fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: 'Request link' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Recovery email was sent')).toBeInTheDocument();
    });
  });

  test('handles error during form submission', async () => {
    renderPage([errorMock]);

    act(() => {
      fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: 'Request link' }));
    });

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
