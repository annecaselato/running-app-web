import PageContainer from '../components/PageContainer';
import { GridColDef } from '@mui/x-data-grid';
import CrudPage from '../components/CrudPage';
import { gql, useQuery } from '@apollo/client';
import TeamForm from '../forms/TeamForm';
import { format } from 'date-fns';

export const GET_COACH_TEAMS = gql`
  query ListCoachTeams {
    listCoachTeams {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation CreateTeam($name: String!, $description: String, $members: [String!]!) {
    createTeam(createTeamInput: { name: $name, description: $description, members: $members }) {
      id
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: String!, $name: String!, $description: String) {
    updateTeam(updateTeamInput: { id: $id, name: $name, description: $description }) {
      id
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: String!) {
    deleteTeam(deleteTeamInput: { id: $id })
  }
`;

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    editable: false,
    minWidth: 200
  },
  {
    field: 'description',
    headerName: 'Description',
    editable: false,
    minWidth: 100,
    flex: 0.5
  },
  {
    field: 'createdAt',
    headerName: 'Creation Date',
    valueFormatter: ({ value }) => value && format(new Date(value), 'dd/MM/yyyy'),
    editable: false,
    minWidth: 120
  }
];

export default function CoachTeams() {
  const { data, refetch } = useQuery(GET_COACH_TEAMS);

  return (
    <PageContainer title="Teams">
      <CrudPage
        columns={columns}
        rows={data?.listCoachTeams || []}
        refetch={refetch}
        FormComponent={TeamForm}
        createMutation={CREATE_TEAM}
        updateMutation={UPDATE_TEAM}
        deleteMutation={DELETE_TEAM}
        detailsPath="/teams"
      />
    </PageContainer>
  );
}
