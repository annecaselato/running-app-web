import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Profile, { DELETE_USER, UPDATE_PASSWORD, UPDATE_USER } from './Profile';
import { ApolloError } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GraphQLError } from 'graphql';
import { logout } from '../logout';

const updateMocks = [
  {
    request: {
      query: UPDATE_USER,
      variables: {
        name: 'New Name'
      }
    },
    result: {
      data: {
        updateUser: {
          id: 'user-id',
          name: 'New Name'
        }
      }
    }
  }
];

const passwordMocks = [
  {
    request: {
      query: UPDATE_PASSWORD,
      variables: {
        oldPassword: 'Pass123!',
        newPassword: 'Pass1234!'
      }
    },
    result: {
      data: {
        updatePassword: {
          id: 'user-id'
        }
      }
    }
  }
];

const deleteMocks = [
  {
    request: {
      query: DELETE_USER
    },
    result: {
      data: {
        deleteUser: {
          id: 'user-id'
        }
      }
    }
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorMocks = (mocks: any[]) => [
  {
    ...mocks[0],
    result: undefined,
    error: new ApolloError({
      errorMessage: 'API error',
      graphQLErrors: [{ message: 'API error' } as GraphQLError],
      networkError: null
    })
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderProfile = (mocks: any[]) =>
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Profile />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );

jest.mock('../logout');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Profile', () => {
  beforeEach(() => {
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'user-id', name: 'Test', email: 'user@example.com' })
    );
  });

  it('renders Profile component and updates user profile', async () => {
    renderProfile(updateMocks);

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('updates user profile', async () => {
    renderProfile(updateMocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'New Name' } });
      fireEvent.click(screen.getAllByText('Save changes')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Update was successful!')).toBeInTheDocument();
      expect(localStorage.getItem('user')).toEqual(
        JSON.stringify({ id: 'user-id', name: 'New Name', email: 'user@example.com' })
      );
    });
  });

  it('handles API error on update', async () => {
    renderProfile(errorMocks(updateMocks));

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'New Name' } });
      fireEvent.click(screen.getAllByText('Save changes')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Update failed. Please try again.')).toBeInTheDocument();
      expect(localStorage.getItem('user')).toEqual(
        JSON.stringify({ id: 'user-id', name: 'Test', email: 'user@example.com' })
      );
    });
  });

  it('handles form error', async () => {
    renderProfile(updateMocks);

    act(() => {
      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: '' } });
      fireEvent.click(screen.getAllByText('Save changes')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('updates user password', async () => {
    renderProfile(passwordMocks);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Old Password *'), { target: { value: 'Pass123!' } });
      fireEvent.change(screen.getByLabelText('New Password *'), { target: { value: 'Pass1234!' } });
      fireEvent.click(screen.getAllByText('Save changes')[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('Update was successful!')).toBeInTheDocument();
    });
  });

  it('handles API error on update password', async () => {
    renderProfile(errorMocks(passwordMocks));

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Old Password *'), { target: { value: 'Pass123!' } });
      fireEvent.change(screen.getByLabelText('New Password *'), { target: { value: 'Pass1234!' } });
      fireEvent.click(screen.getAllByText('Save changes')[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('Update failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('deletes user account', async () => {
    renderProfile(deleteMocks);

    await act(async () => {
      fireEvent.click(screen.getAllByText('Delete Account')[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });

  it('handles API error on delete account', async () => {
    renderProfile(errorMocks(deleteMocks));

    await act(async () => {
      fireEvent.click(screen.getAllByText('Delete Account')[1]);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
      expect(logout).not.toHaveBeenCalled();
    });
  });
});
