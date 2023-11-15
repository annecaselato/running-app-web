import { Box, Grid, Typography } from '@mui/material';
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import PageContainer from '../components/PageContainer';
import DayScheduleCard from '../components/DayScheduleCard';
import ActivityForm, { Activity, ActivityBody } from '../forms/ActivityForm';
import { useRef, useState } from 'react';
import { CREATE_ACTIVITY, UPDATE_ACTIVITY } from './Activity';
import { toast } from 'react-toastify';

export const GET_WEEK_ACTIVITIES = gql`
  query ListWeekActivities($startAt: DateTime!) {
    listWeekActivities(listWeekActivitiesInput: { startAt: $startAt }) {
      day
      activities {
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

export default function Home() {
  const now = useRef(new Date());
  const today = new Date(
    now.current.getFullYear(),
    now.current.getMonth(),
    now.current.getDate(),
    0,
    0,
    0
  );
  const { data, refetch } = useQuery(GET_WEEK_ACTIVITIES, { variables: { startAt: today } });
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [updateActivity] = useMutation(UPDATE_ACTIVITY);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Activity | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const closeFormModal = () => {
    setEditItem(undefined);
    setSelectedDate(undefined);
    setOpen(false);
    refetch();
  };

  const handleCreate = async (body: ActivityBody) => {
    try {
      return await createActivity({ variables: body });
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
      return await updateActivity({ variables: { id, ...body } });
    } catch (err) {
      if (err instanceof ApolloError && err.graphQLErrors.length) {
        toast.error(err.graphQLErrors[0].message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  const handleAdd = (date: Date) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditItem(activity);
    setOpen(true);
  };

  return (
    <PageContainer title={'Home'}>
      <Typography variant="h5" sx={{ pt: 2 }}>
        Week Schedule
      </Typography>
      <Box sx={{ margin: 2 }}>
        <Grid
          container
          spacing={2}
          columns={{ xs: 1, sm: 1, md: 4 }}
          justifyContent="center"
          alignItems="center">
          <Grid item xs={1} sm={1} md={1}>
            <DayScheduleCard
              data={data?.listWeekActivities[0]}
              handleAdd={handleAdd}
              handleEdit={handleEdit}
              isToday
            />
          </Grid>
          <Grid item xs={1} sm={1} md={3}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 3 }} alignItems="stretch">
              {data?.listWeekActivities
                .slice(1)
                .map((item: { day: Date; activities: Activity[] }, index: number) => (
                  <Grid item key={index} xs={1} sm={1} md={1}>
                    <DayScheduleCard data={item} handleAdd={handleAdd} handleEdit={handleEdit} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <ActivityForm
        open={open}
        handleClose={closeFormModal}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        edit={editItem}
        selectedDate={selectedDate}
      />
    </PageContainer>
  );
}
