import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import PageContainer from '../components/PageContainer';
import CrudGrid from '../components/CrudGrid';
import { DELETE_MEMBER } from './TeamMembers';

export const GET_ATHLETE_TEAMS = gql`
  query ListAthleteTeams {
    listAthleteTeams {
      invitations {
        id
        team {
          id
          name
          description
          coach {
            id
            name
          }
        }
      }
      teams {
        id
        acceptedAt
        team {
          id
          name
          coach {
            id
            name
          }
        }
      }
    }
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($id: String!) {
    acceptInvitation(acceptInvitationInput: { id: $id }) {
      id
    }
  }
`;

const columns: GridColDef[] = [
  {
    field: 'team',
    headerName: 'Team',
    valueGetter: (params) => params.row.team.name,
    editable: false,
    minWidth: 200
  },
  {
    field: 'description',
    headerName: 'Description',
    valueGetter: (params) => params.row.team.description,
    editable: false,
    minWidth: 100,
    flex: 0.5
  },
  {
    field: 'coach',
    headerName: 'Coach',
    valueGetter: (params) => params.row.team.coach.name,
    editable: false,
    minWidth: 100
  },
  {
    field: 'acceptedAt',
    headerName: 'Join Date',
    valueFormatter: ({ value }) => value && format(new Date(value), 'dd/MM/yyyy'),
    editable: false,
    minWidth: 120
  }
];

interface Invitation {
  id: string;
  team: {
    id: string;
    name: string;
    description: string;
    coach: {
      id: string;
      name: string;
    };
  };
}

export default function AthleteTeams() {
  const { data, refetch } = useQuery(GET_ATHLETE_TEAMS);
  const [acceptInvitation] = useMutation(ACCEPT_INVITATION);
  const [leaveTeam] = useMutation(DELETE_MEMBER);

  const handleAccept = async (id: GridRowId) => {
    try {
      await acceptInvitation({ variables: { id } });
      refetch();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleDelete = async (id: GridRowId) => {
    try {
      await leaveTeam({ variables: { id } });
      refetch();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  return (
    <PageContainer title="Teams">
      <Box sx={{ width: '100%', padding: { sm: 3 } }}>
        <List
          sx={{
            width: '100%',
            padding: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderRadius: 1,
            borderColor: (theme) => theme.palette.grey[300]
          }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Invitations
          </Typography>
          {!data?.listAthleteTeams.invitations.length && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {"You don't have any invitations right now"}
            </Typography>
          )}
          {data?.listAthleteTeams.invitations.map((invitation: Invitation, index: number) => (
            <>
              <ListItem
                alignItems="flex-start"
                key={invitation.id}
                secondaryAction={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: 90
                    }}>
                    <Button
                      variant="contained"
                      aria-label="accept-invitation"
                      sx={{ padding: 2, minWidth: 0, height: 0, marginRight: 1 }}
                      onClick={() => handleAccept(invitation.id)}>
                      <Check />
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ padding: 2, minWidth: 0, height: 0 }}
                      onClick={() => handleDelete(invitation.id)}>
                      <Close />
                    </Button>
                  </Box>
                }>
                <ListItemText
                  primary={invitation.team.name}
                  secondary={
                    <Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary">
                        {invitation.team.coach.name}
                      </Typography>
                      {' — ' + invitation.team.description}
                    </Fragment>
                  }
                />
              </ListItem>
              {index + 1 < data?.listAthleteTeams.invitations.length && <Divider component="li" />}
            </>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '100%', padding: { sm: 3 } }}>
        <CrudGrid
          rows={data?.listAthleteTeams.teams || []}
          columns={columns}
          handleDelete={handleDelete}
        />
      </Box>
    </PageContainer>
  );
}
