import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { ApolloError, gql } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastContainer } from 'react-toastify';
import CrudPage from './CrudPage';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';

const CREATE_MUTATION = gql`
  mutation CreateItem($name: String!, $email: String!) {
    createItem(createItemInput: { name: $name, email: $email }) {
      id
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation UpdateItem($id: String!, $name: String!, $email: String!) {
    updateItem(updateItemInput: { id: $id, name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation DeleteItem($id: String!) {
    deleteItem(deleteItemInput: { id: $id })
  }
`;

const createMock = [
  {
    request: {
      query: CREATE_MUTATION,
      variables: { name: 'New User', email: 'newuser@example.com' }
    },
    result: {
      data: {
        createItem: {
          id: '3'
        }
      }
    }
  }
];

const updateMock = [
  {
    request: {
      query: UPDATE_MUTATION,
      variables: { id: '1', name: 'New User', email: 'newuser@example.com' }
    },
    result: {
      data: {
        updateItem: {
          id: '1',
          name: 'New User',
          email: 'newuser@example.com'
        }
      }
    }
  }
];

const deleteMock = [
  {
    request: {
      query: DELETE_MUTATION,
      variables: { id: '1' }
    },
    result: {
      data: {
        deleteItem: {
          id: '1'
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

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    editable: false,
    minWidth: 200
  },
  {
    field: 'email',
    headerName: 'Email',
    editable: false,
    minWidth: 100,
    flex: 0.5
  }
];
const rows = [
  { id: '1', name: 'User One', email: 'user@one.com' },
  { id: '2', name: 'User Two', email: 'user@two.com' }
];
const refetchMock = jest.fn();
const createMutationMock = CREATE_MUTATION;
const updateMutationMock = UPDATE_MUTATION;
const deleteMutationMock = DELETE_MUTATION;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockForm = ({ open, handleClose, handleCreate, handleUpdate, edit }: any) => {
  const [name, setName] = useState(edit?.name || '');
  const [email, setEmail] = useState(edit?.email || '');
  return (
    <Modal open={open} onClose={handleClose}>
      <Box>
        <Typography> {edit ? 'Edit Item' : 'Add Item'} </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={(event) => {
            edit ? handleUpdate(edit.id, { name, email }) : handleCreate({ name, email });
            handleClose();
            event.preventDefault();
          }}>
          <TextField
            label="Name"
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            label="Email"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Button type="submit">Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

const mockProps = {
  columns,
  rows,
  refetch: refetchMock,
  FormComponent: MockForm,
  createMutation: createMutationMock,
  updateMutation: updateMutationMock,
  deleteMutation: deleteMutationMock
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = (mocks: any[]) =>
  render(
    <>
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CrudPage {...mockProps} />
        </MockedProvider>
      </MemoryRouter>
      <ToastContainer />
    </>
  );

describe('CrudPage', () => {
  it('renders the CrudPage component', () => {
    renderPage(createMock);

    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('handles creating a new item', async () => {
    renderPage(createMock);

    fireEvent.click(screen.getByText('Add New'));

    await act(async () => {
      userEvent.type(screen.getAllByLabelText('Name')[0], 'New User');
      userEvent.type(screen.getAllByLabelText('Email')[0], 'newuser@example.com');
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Submit')).toBeNull();
      expect(screen.queryByText('New User')).toBeNull();
    });
  });

  it('handles errors when creating a new item', async () => {
    renderPage(errorMocks(createMock));

    fireEvent.click(screen.getByText('Add New'));

    await act(async () => {
      userEvent.type(screen.getAllByLabelText('Name')[0], 'New User');
      userEvent.type(screen.getAllByLabelText('Email')[0], 'newuser@example.com');
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  it('handles updating a item', async () => {
    renderPage(updateMock);

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Edit Row' })[0]);

    await act(async () => {
      userEvent.type(screen.getAllByLabelText('Name')[0], 'New User');
      userEvent.type(screen.getAllByLabelText('Email')[0], 'newuser@example.com');
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Submit')).toBeNull();
      expect(screen.queryByText('New User')).toBeNull();
    });
  });

  it('handles errors when updating a item', async () => {
    renderPage(errorMocks(updateMock));

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Edit Row' })[0]);

    await act(async () => {
      userEvent.type(screen.getAllByLabelText('Name')[0], 'New User');
      userEvent.type(screen.getAllByLabelText('Email')[0], 'newuser@example.com');
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  it('handles deleting a item', async () => {
    renderPage(deleteMock);

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Delete Row' })[0]);
  });

  it('handles errors when deleting a item', async () => {
    renderPage(errorMocks(deleteMock));

    fireEvent.click(screen.getAllByRole('menuitem', { name: 'Delete Row' })[0]);

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });
});
