import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastContainer } from 'react-toastify';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import PasswordRecovery, { RESET_PASSWORD } from './PasswordRecovery';

const request = {
  query: RESET_PASSWORD,
  variables: { token: 'your_token', password: 'NewPass123!' }
};

const resetMock = {
  request,
  result: {
    data: {
      resetPassword: true
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
  useParams: () => ({
    token: 'your_token'
  }),
  useRouteMatch: () => ({ url: '/recovery/your_token' }),
  useNavigate: () => mockNavigate
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any[]) => {
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PasswordRecovery />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );
};

describe('PasswordRecovery', () => {
  test('renders page', () => {
    renderPage([resetMock]);

    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
  });

  test('submits form and handles success', async () => {
    renderPage([resetMock]);

    act(() => {
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), {
        target: { value: 'NewPass123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
    });
  });

  test('handles error during form submission', async () => {
    renderPage([errorMock]);

    act(() => {
      fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), {
        target: { value: 'NewPass123!' }
      });

      fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
    });

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });
});
