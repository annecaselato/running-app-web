import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Types, { GET_USER_TYPES } from './Types';

const mocks = [
  {
    request: {
      query: GET_USER_TYPES
    },
    result: {
      data: {
        listTypes: [
          {
            id: '1',
            type: 'Type 1',
            description: 'Description 1'
          },
          {
            id: '2',
            type: 'Type 2',
            description: 'Description 2'
          }
        ]
      }
    }
  }
];

describe('Types', () => {
  it('renders the Types page and displays data', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Types />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Type 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Type 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });
});
