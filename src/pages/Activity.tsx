import { gql, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { GridColDef } from '@mui/x-data-grid';
import PageContainer from '../components/PageContainer';
import ActivityForm from '../forms/ActivityForm';
import CrudPage from '../components/CrudPage';

export const GET_USER_ACTIVITIES = gql`
  query ListActivities($memberId: String) {
    listActivities(listActivitiesInput: { memberId: $memberId }) {
      user
      rows {
        id
        datetime
        status
        type
        goalDistance
        distance
        goalDuration
        duration
      }
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity(
    $datetime: DateTime!
    $status: String!
    $type: String!
    $goalDistance: Float
    $distance: Float
    $goalDuration: String
    $duration: String
    $memberId: String
  ) {
    createActivity(
      createActivityInput: {
        datetime: $datetime
        status: $status
        type: $type
        goalDistance: $goalDistance
        distance: $distance
        goalDuration: $goalDuration
        duration: $duration
        memberId: $memberId
      }
    ) {
      id
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity(
    $id: String!
    $datetime: DateTime!
    $status: String!
    $type: String!
    $goalDistance: Float
    $distance: Float
    $goalDuration: String
    $duration: String
    $memberId: String
  ) {
    updateActivity(
      updateActivityInput: {
        id: $id
        datetime: $datetime
        status: $status
        type: $type
        goalDistance: $goalDistance
        distance: $distance
        goalDuration: $goalDuration
        duration: $duration
        memberId: $memberId
      }
    ) {
      id
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($id: String!, $memberId: String) {
    deleteActivity(deleteActivityInput: { id: $id, memberId: $memberId })
  }
`;

export const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Date',
    valueGetter: (params) => params.row.datetime,
    valueFormatter: ({ value }) => value && format(new Date(value), 'dd/MM/yyyy'),
    editable: false
  },
  {
    field: 'time',
    headerName: 'Time',
    valueGetter: (params) => params.row.datetime,
    valueFormatter: ({ value }) => value && format(new Date(value), 'HH:mm'),
    editable: false
  },
  {
    field: 'type',
    headerName: 'Type',
    editable: false,
    minWidth: 100,
    flex: 0.5
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: false
  },
  {
    field: 'goalDistance',
    headerName: 'Goal Distance (km)',
    type: 'number',
    align: 'left',
    headerAlign: 'left',
    editable: false
  },
  {
    field: 'distance',
    headerName: 'Distance (km)',
    type: 'number',
    align: 'left',
    headerAlign: 'left',
    editable: false
  },
  {
    field: 'goalDuration',
    headerName: 'Goal Duration',
    editable: false
  },
  {
    field: 'duration',
    headerName: 'Duration',
    editable: false
  }
];

export default function Activity() {
  const { data, refetch } = useQuery(GET_USER_ACTIVITIES);

  return (
    <PageContainer title="Activity">
      <CrudPage
        columns={columns}
        rows={data?.listActivities?.rows || []}
        refetch={refetch}
        FormComponent={ActivityForm}
        createMutation={CREATE_ACTIVITY}
        updateMutation={UPDATE_ACTIVITY}
        deleteMutation={DELETE_ACTIVITY}
      />
    </PageContainer>
  );
}
