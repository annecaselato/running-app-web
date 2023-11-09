import { gql, useQuery } from '@apollo/client';
import { GridColDef } from '@mui/x-data-grid';
import PageContainer from '../components/PageContainer';
import TypeForm from '../forms/TypeForm';
import CrudPage from '../components/CrudPage';

export const GET_USER_TYPES = gql`
  query ListTypes {
    listTypes {
      id
      type
      description
    }
  }
`;

export const CREATE_TYPE = gql`
  mutation CreateType($type: String!, $description: String) {
    createType(createTypeInput: { type: $type, description: $description }) {
      id
    }
  }
`;

export const UPDATE_TYPE = gql`
  mutation UpdateType($id: String!, $type: String!, $description: String) {
    updateType(updateTypeInput: { id: $id, type: $type, description: $description }) {
      id
    }
  }
`;

export const DELETE_TYPE = gql`
  mutation DeleteType($id: String!) {
    deleteType(deleteTypeInput: { id: $id })
  }
`;

const columns: GridColDef[] = [
  {
    field: 'type',
    headerName: 'Type',
    editable: false,
    minWidth: 200
  },
  {
    field: 'description',
    headerName: 'Description',
    editable: false,
    minWidth: 100,
    flex: 0.5
  }
];

export default function Types() {
  const { data, refetch } = useQuery(GET_USER_TYPES);

  return (
    <PageContainer title="Types">
      <CrudPage
        columns={columns}
        rows={data?.listTypes || []}
        refetch={refetch}
        FormComponent={TypeForm}
        createMutation={CREATE_TYPE}
        updateMutation={UPDATE_TYPE}
        deleteMutation={DELETE_TYPE}
      />
    </PageContainer>
  );
}
