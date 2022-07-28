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
        alignItems: 'center',
        width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`
        
      }}
      >
       
          {manageExercise && <ManageExercise />}

      

          {addworkout && <AddWorkout />}
      </Grid>





    </Container>

  )
}

export default DashBoard;