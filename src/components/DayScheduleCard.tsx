import { Edit } from '@mui/icons-material';
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { Activity } from '../forms/ActivityForm';

interface DayScheduleProps {
  data: {
    day: string;
    activities: Activity[];
  };
  handleAdd: (date: Date) => void;
  handleEdit: (activity: Activity) => void;
  isToday?: boolean;
}

export default function DayScheduleCard({
  data,
  handleAdd,
  handleEdit,
  isToday
}: DayScheduleProps) {
  return (
    data && (
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: 2,
          bgcolor: 'background.paper',
          border: isToday ? 2 : 1,
          borderRadius: 1,
          borderColor: (theme) => (isToday ? theme.palette.primary.main : theme.palette.grey[300])
        }}>
        <Typography component="h2" variant="h6" color="primary">
          {format(new Date(data?.day), 'eeee, MMM dd')}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => handleAdd(new Date(data?.day))}>
          Add New
        </Button>
        {!data.activities.length && (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}>
            {"You don't have any activities on this day yet"}
          </Typography>
        )}
        {data.activities.map((activity: Activity, index: number) => (
          <div key={activity.id}>
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
              <ListItemText
                disableTypography
                primary={format(new Date(activity.datetime), 'HH:mm')}
                sx={{ flexGrow: 0, mr: 2 }}
              />
              <ListItemText>
                <Typography>{activity.type}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                  {activity.status}
                </Typography>
                <ul>
                  <li>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                      Goal Distance: {activity.goalDistance ? activity.goalDistance + ' km' : '—'}
                    </Typography>
                  </li>
                  <li>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                      Distance: {activity.distance ? activity.distance + ' km' : '—'}
                    </Typography>
                  </li>
                  <li>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                      Goal Duration: {activity.goalDuration || '—'}
                    </Typography>
                  </li>
                  <li>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                      Duration: {activity.duration || '—'}
                    </Typography>
                  </li>
                </ul>
              </ListItemText>
              <ListItemText sx={{ flexGrow: 0, ml: 1 }}>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    handleEdit(activity);
                  }}
                  sx={{ padding: 1 }}>
                  <Edit />
                </IconButton>
              </ListItemText>
            </ListItem>
            {index + 1 < data.activities.length && <Divider component="li" />}
          </div>
        ))}
      </List>
    )
  );
}
