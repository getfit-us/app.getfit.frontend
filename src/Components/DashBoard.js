import { Container, Drawer, Typography, MenuItem, Button, Paper, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ManageExercise from "../Features/ManageExercise";
import AddWorkout from '../Features/AddWorkouts';
import WorkoutLists from '../Features/WorkoutLists';
import { useState} from 'react';
import Users from './Users';
import useAuth from '../utils/useAuth';


const DRAWER_WIDTH = 200;



const DashBoard = () => {
  const [manageExercise, setManageExercise] = useState(false);
  const [addworkout, setAddworkout] = useState(false);
  const [workouts, setWorkouts] = useState(false);
  const [users, setUsers] = useState(false);
  const {  auth } = useAuth();






  return (
    <Container mt={3}  >
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            ['@media (max-width:600px)']: { // eslint-disable-line no-useless-computed-key
              width: '10%'},
            boxSizing: 'border-box',  
          },
        }}
        variant="permanent"
        anchor="left"
      >

        <Typography variant='h5'>Dashboard</Typography>

        <List>
          <ListItem disablePadding>

            <ListItemButton variant="text" onClick={() => setAddworkout(prev => (!prev))}>Add Workout <AddTaskIcon sx={{ marginLeft: 1 }} /></ListItemButton>

          </ListItem>
          <ListItem disablePadding>
          {auth.roles.includes(10)  ?<ListItemButton variant="text" onClick={() => setManageExercise(prev => (!prev))}  >Manage Exercises <FitnessCenterIcon sx={{ marginLeft: 1 }} /></ListItemButton> : <></>}
          </ListItem>



          <ListItem disablePadding>

           {auth.roles.includes(10) &&   <ListItemButton variant="text" onClick={() => setWorkouts(prev => (!prev))} >Workout List <PersonIcon sx={{ marginLeft: 1 }} /></ListItemButton>}

          </ListItem>
          <ListItem disablePadding>
          {auth.roles.includes(10) && <ListItemButton variant="text" onClick={() => setUsers(prev => (!prev))} >Manage Users <PersonIcon sx={{ marginLeft: 1 }} /></ListItemButton>}
 </ListItem>
        </List>

      </Drawer>
      <Grid sx={{
        justifyContent: 'center',
        alignItems: 'center',
        width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px`

      }}
      >

        {manageExercise && <ManageExercise />}


        {addworkout && <AddWorkout />}

        {workouts && <WorkoutLists />}

        {users && <Users />}
      </Grid>





    </Container>

  )
}

const styles = theme => ({
  root: {
    backgroundColor: 'blue',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'red',
    },
  },
});

export default DashBoard;