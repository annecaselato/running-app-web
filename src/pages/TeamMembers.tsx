import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import CrudGrid from '../components/CrudGrid';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import MemberForm from '../forms/MemberForm';
import { ArrowBack } from '@mui/icons-material';

export const GET_TEAM = gql`
  query GetTeam($id: String!) {
    getTeam(getTeamInput: { id: $id }) {
      id
      name
      description
      coach {
        id
        name
      }
      members {
        id
        email
        acceptedAt
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_MEMBER = gql`
  mutation CreateMembers($id: String!, $members: [String!]!) {
    createMembers(createMembersInput: { id: $id, members: $members }) {
      id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: String!) {
    deleteMember(deleteMemberInput: { id: $id })
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
    field: 'email',
    headerName: 'Email',
    editable: false,
    minWidth: 100,
    flex: 0.5
  },
  {
    field: 'status',
    headerName: 'Status',
    valueGetter: (params) => (params.row.user ? 'Joined' : 'Invited'),
    editable: false,
    minWidth: 100
  },
  {
    field: 'createdAt',
    headerName: 'Invitation Date',
    valueFormatter: ({ value }) => value && format(new Date(value), 'dd/MM/yyyy'),
    editable: false,
    minWidth: 120
  },
  {
    field: 'acceptedAt',
    headerName: 'Join Date',
    valueFormatter: ({ value }) => value && format(new Date(value), 'dd/MM/yyyy'),
    editable: false,
    minWidth: 120
  }
];

export default function TeamMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, refetch } = useQuery(GET_TEAM, { variables: { id } });
  const [createItem] = useMutation(CREATE_MEMBER);
  const [deleteItem] = useMutation(DELETE_MEMBER);
  const [open, setOpen] = useState(false);

  const openFormModal = () => {
    setOpen(true);
  };

  const closeFormModal = () => {
    setOpen(false);
    refetch();
  };

  const handleCreate = async (members: string[]) => {
    try {
      return await createItem({ variables: { id, members } });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleDelete = async (memberId: GridRowId) => {
    try {
      await deleteItem({ variables: { id: memberId } });
      refetch();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleDetails = (memberId: GridRowId) => {
    navigate(`/activity/${memberId}`, { replace: true });
  };

  return (
    <PageContainer title={`Team: ${data?.getTeam.name}`}>
      <Box sx={{ width: '100%', padding: { sm: 3 } }}>
        <Button
          size="large"
          variant="contained"
          onClick={() => navigate('/teams', { replace: true })}
          sx={{ marginBottom: 2 }}
          startIcon={<ArrowBack />}>
          Back to teams
        </Button>
        <CrudGrid
          rows={data?.getTeam.members || []}
          columns={columns}
          handleAdd={openFormModal}
          handleDelete={handleDelete}
          handleDetails={handleDetails}
        />
        <MemberForm open={open} handleClose={closeFormModal} handleCreate={handleCreate} />
      </Box>
    </PageContainer>
  );
}
