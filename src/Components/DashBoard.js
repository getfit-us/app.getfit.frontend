import { Container, Drawer, Typography, MenuItem, Button, Paper, Grid, List, ListItem, ListItemButton, ListItemText, Tooltip, Divider, stepLabelClasses } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ManageExercise from "../Features/ManageExercise";
import AddWorkout from '../Features/AddWorkouts';
import WorkoutLists from '../Features/WorkoutLists';
import { useState, useEffect } from 'react';
import Users from './Users';
import useProfile from '../utils/useProfile';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useMediaQuery from '@mui/material/useMediaQuery';
import Profile from '../Pages/Profile';
import ViewWorkouts from './ViewWorkouts';


const DRAWER_WIDTH = 200;



const DashBoard = ({ theme, profile, setProfile }) => {
  const [page, setPage] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(true);
  const [onClose, set] = useState();
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  


  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(() => {
    //set global state
    //grab workouts
    if (!state.workouts[0]) getWorkouts(state.profile.clientId);



      if (profile) {
        
        setPage(<Profile/> );
        setProfile(prev => !prev)
      }
      
  }, [profile])




  const getWorkouts = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/workouts/client/${id}`, { signal: controller.signal });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: 'SET_WORKOUTS', payload: response.data })
      setLoading(false)
      // console.log(state.workouts)

    }
    catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth. 
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();

    }

  }




  if (lgUp) {
  return (

    
    <Container mt={3} sx={{ minHeight: '100vh' }} >
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            ['@media (max-width:600px)']: { // eslint-disable-line no-useless-computed-key
              width: '10%'
            },
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        style={styles.root}
      >

        <Typography variant='h5'>Dashboard</Typography>

        <List>
          <ListItem disablePadding>
            <Tooltip title="Add Workout" placement='right-start'>
              <ListItemButton variant="text" onClick={() =>

                setPage(<AddWorkout />)}><AddTaskIcon sx={{ marginRight: 1 }} /> Add Workout </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <ListItem disablePadding>

            {state.profile.roles.includes(10) &&
              <Tooltip title="Manage Exercises" placement='right'>
                <ListItemButton variant="text" onClick={() => setPage(<ManageExercise />)}  ><FitnessCenterIcon sx={{ marginRight: 1 }} />Manage Exercises </ListItemButton>
              </Tooltip>

            }
          </ListItem>





          <ListItem disablePadding>
            {state.profile.roles.includes(10) && <Tooltip title="Users" placement='right'>
              <ListItemButton variant="text" onClick={() => setPage(<Users />)} ><PersonIcon sx={{ marginRight: 1 }} />Manage Users </ListItemButton>
            </Tooltip>}
          </ListItem>


          <ListItem disablePadding>
            <Tooltip title="View Workouts" placement='right'>
              <ListItemButton variant="text" onClick={() => setPage(<ViewWorkouts/>)} ><FitnessCenterIcon sx={{ marginRight: 1 }} />View Workouts </ListItemButton>
            </Tooltip>
          </ListItem>


        </List>

      </Drawer>

      <Grid sx={{
        justifyContent: 'center',
        alignItems: 'center',
        width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px`

      }}
      >

        {page && page}



      </Grid>





    </Container>
  )
  } 
    return (
<Drawer
      anchor="left"
      onClose={onClose}
      open={false}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 100
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      sdfads
    </Drawer>
    )
  
}

const styles = (theme) => ({
  root: {
    backgroundColor: 'blue',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'red',
    },
  },
});

export default DashBoard;