import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import {
  CREATE_ACTIVITY,
  DELETE_ACTIVITY,
  GET_USER_ACTIVITIES,
  UPDATE_ACTIVITY,
  columns
} from './Activity';
import PageContainer from '../components/PageContainer';
import CrudGrid from '../components/CrudGrid';
import ActivityForm, { ActivityBody } from '../forms/ActivityForm';
import { EnumProfiles } from '../models/EnumProfiles';

export default function MemberActivity() {
  const { id: memberId } = useParams();
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const { profile } = userString && JSON.parse(userString);
  const { data, refetch } = useQuery(GET_USER_ACTIVITIES, { variables: { memberId } });
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [updateActivity] = useMutation(UPDATE_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_ACTIVITY);
  const [editActivity, setEditActivity] = useState(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (profile !== EnumProfiles.COACH) {
      navigate('/activity', { replace: true });
    }
  }, []);

  const openFormModal = () => {
    setOpen(true);
  };

  const closeFormModal = () => {
    setEditActivity(undefined);
    setOpen(false);
    refetch();
  };

  const handleCreate = async (body: ActivityBody) => {
    try {
      return await createActivity({ variables: { ...body, memberId } });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleUpdate = async (id: string, body: ActivityBody) => {
    try {
      return await updateActivity({ variables: { id, ...body, memberId } });
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
      await deleteActivity({ variables: { id, memberId } });
      refetch();
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleEdit = (id: GridRowId) => {
    setEditActivity(data?.listActivities.find((item: { id: GridRowId }) => item.id === id));
    setOpen(true);
  };

  return (
    <PageContainer title={`Activity: ${data?.listActivities?.user}`}>
      <Box sx={{ width: '100%', padding: { sm: 3 } }}>
        <CrudGrid
          rows={data?.listActivities?.rows || []}
          columns={columns}
          handleAdd={openFormModal}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <ActivityForm
          open={open}
          handleClose={closeFormModal}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          edit={editActivity}
        />
      </Box>
    </PageContainer>
  );
}
