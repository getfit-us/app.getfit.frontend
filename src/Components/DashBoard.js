import { Container, Drawer, Typography, MenuItem, Button, Paper, Grid, List, ListItem, ListItemButton } from '@mui/material'

import ManageExercise from "../Features/ManageExercise";
import AddWorkout from '../Features/AddWorkouts';
import { useState, useEffect } from 'react';
import Clients from './Clients';


const drawerWidth = 200;



const DashBoard = () => {
  const [manageExercise, setManageExercise] = useState(false);
  const [addworkout, setAddworkout] = useState(true);
  const [clients, setClients] = useState(false);


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

          <ListItem disablePadding>

            <ListItemButton variant="text" onClick={() => setClients(prev => (!prev))} >Manage Clients</ListItemButton>

          </ListItem>
        </List>

      </Drawer>
      <Grid sx={{
        justifyContent: 'center',
        alignItems: 'center',
        width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`

      }}
      >

        {manageExercise && <ManageExercise />}

        {clients && <Clients />}

        {addworkout && <AddWorkout />}
      </Grid>





    </Container>

  )
}

export default DashBoard;