import { Container, Drawer, Typography, MenuItem, Button, Paper, Grid, List, ListItem, ListItemButton } from '@mui/material'
import { Link } from 'react-router-dom';
import ManageExercise from "../Features/ManageExercise";
import AddWorkout from '../Features/AddWorkouts';
import { useState, useEffect } from 'react';


const drawerWidth = 200;



const DashBoard = () => {
  const [manageExercise, setManageExercise] = useState(false);
  const [addworkout, setAddworkout] = useState(false);


  useEffect(() => {



  }, [addworkout, manageExercise])

  return (
    <Container mt={3} >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >

        <Typography variant='h5'>Dashboard</Typography>

        <List>
          <ListItem disablePadding>

            <ListItemButton variant="text" onClick={() => setAddworkout(prev => (!prev))} >Add Workout</ListItemButton>






          </ListItem>
          <ListItem disablePadding>           <ListItemButton variant="text" onClick={() => setManageExercise(prev => (!prev))}  >Manage Exercises</ListItemButton>
          </ListItem>
        </List>

      </Drawer>
      <Grid sx={{
        justifyContent: 'center',
      }}>
        <Paper elevation={3}>
          {manageExercise && <ManageExercise />}

        </Paper>

        <Paper elevation={3}>
          {addworkout && <AddWorkout />}
        </Paper>
      </Grid>


      <ul>
        <li><Link to="/clientlist">Client List</Link></li>
        <li><Link to="/userlist">Users List</Link></li>
        <li><Link to="/addworkout">Add Workouts </Link></li>
        <li><Link to="/manageexercises">Manage Exercises </Link></li>


      </ul>




    </Container>

  )
}

export default DashBoard;