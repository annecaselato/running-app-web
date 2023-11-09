import { act, fireEvent, render, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MemoryRouter } from 'react-router-dom';
import ActivityForm, { Activity } from './ActivityForm';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

const listMocks = [
  {
    request: {
      query: gql`
        query ListTypes {
          listTypes {
            id
            type
            description
          }
        }
      `
    },
    result: {
      data: {
        listTypes: [
          {
            id: '1',
            type: 'Type One',
            description: null
          }
        ]
      }
    }
  }
];

const handleCloseMock = jest.fn();
const handleCreateMock = jest.fn();
const handleUpdateMock = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderForm = (mocks: any[], edit?: Activity) => {
  render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ActivityForm
            open={true}
            handleClose={handleCloseMock}
            handleCreate={handleCreateMock}
            handleUpdate={handleUpdateMock}
            edit={edit}
          />
        </MockedProvider>
      </MemoryRouter>
    </LocalizationProvider>
  );
};

describe('ActivityForm', () => {
  beforeEach(() => {
    handleCreateMock.mockResolvedValue({
      data: {
        createActivity: {
          id: '1',
          datetime: new Date(),
          type: 'Type One',
          status: 'Planned'
        }
      }
    });

    handleUpdateMock.mockResolvedValue({
      data: {
        updateActivity: {
          id: '1',
          datetime: new Date(),
          type: 'Type One',
          status: 'Planned'
        }
      }
    });
  });

  it('handles creation of activities correctly', async () => {
    renderForm(listMocks);

    const goalDistanceInput = screen.getByLabelText('Goal Distance');
    const distanceInput = screen.getByLabelText('Distance');
    const saveButton = screen.getByText('Save');

    await act(async () => {
      fireEvent.change(goalDistanceInput, { target: { value: '5' } });
      fireEvent.change(distanceInput, { target: { value: '3' } });

      fireEvent.click(saveButton);
    });
  });
});
