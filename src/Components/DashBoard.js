import { Container, Typography, MenuItem, Button, Paper, Grid, List, ListItem, ListItemButton, ListItemText, Tooltip, Divider, stepLabelClasses } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';

import AddTaskIcon from '@mui/icons-material/AddTask';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StraightenIcon from '@mui/icons-material/Straighten';
import ManageExercise from "../Features/ManageExercise";
import AddWorkout from '../Features/AddWorkouts';
import { useState, useEffect } from 'react';
import Users from './Users';
import useProfile from '../utils/useProfile';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useMediaQuery from '@mui/material/useMediaQuery';
import Profile from '../Pages/Profile';
import ViewWorkouts from './ViewWorkouts';
import Measurements from '../Features/Measurements';
import ProgressPics from './ProgressPics';
import { Photo } from '@mui/icons-material';



const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});




const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',

    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),

    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);







const DashBoard = ({ profile, setProfile, theme }) => {
  const [page, setPage] = useState(<Profile />);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(true);
  const [onClose, setClose] = useState();
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();





  //change to small for now until I fix the second drawer type
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(() => {
    //set global state
    //grab workouts
    if (!state.workouts[0]) getWorkouts(state.profile.clientId);
    if (!state.measurements[0]) getAllMeasurements(state.profile.clientId);


    if (profile) {

      setPage(<Profile />);
      setProfile(prev => !prev)
    }

    if (lgUp) {
      setOpen(true);
    } else {
      setOpen(false);
    }


  }, [profile, lgUp])




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

  const getAllMeasurements = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, { signal: controller.signal });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: 'SET_MEASUREMENTS', payload: response.data })
      setLoading(false)
      // console.log(state.measurements)

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


  // console.log(page, (page.type.name === "AddWorkoutForm"))


  return (


    <Container mt={3} sx={{ minHeight: '100vh' }} >
      <Drawer
        PaperProps={{
          sx: {
            bgcolor: '#aeaeae',
            color: 'black',
            borderRadius: 4,
            padding: -4,
            marginBottom: 1,
            border: '2px double black'
          }
        }}
        variant="permanent"

        open={open}
        sx={{ textAlign: 'center' }}
      >

        {lgUp && <Typography variant='h5' sx={{ mb: 1, mt: 1 }}>DASHBOARD</Typography>


        }
        <Divider sx={{ fontWeight: 'bold' }} />

        <List  >
          <ListItem disablePadding >
            <Tooltip title="Add Workout" placement='right-start'>
              <ListItemButton variant="text"
                className='dashboardBtn'
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: '#3070AF',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#689ee1',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    },

                    '&:hover': {
                      backgroundColor: '#3070AF'
                    },
                    margin: .2

                  },
                  overflow: 'hidden',
                  borderRadius: 4,
                  margin: .2
                }}
                selected={(page.type.name === "AddWorkoutForm") ? true : false}

                onClick={() =>

                  setPage(<AddWorkout theme={theme} />)}><AddTaskIcon sx={{ marginRight: 1 }} /> {lgUp && `Add Workout `}</ListItemButton>
            </Tooltip>
          </ListItem>

          <ListItem disablePadding>

            {state.profile.roles.includes(10) &&
              <Tooltip title="Manage Exercises" placement='right'>
                <ListItemButton variant="text"

                  sx={{
                    [`& .active, &:hover`]: {
                      backgroundColor: '#3070AF',
                      fontWeight: "bold",
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: "2px 2px 2px #000f",
                      "& svg": {
                        fill: '#000'
                      }
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#689ee1',
                      fontWeight: "bold",
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: "2px 2px 2px #000f",
                      "& svg": {
                        fill: '#000'
                      },

                      '&:hover': {
                        backgroundColor: '#3070AF'
                      },
                      margin: .2

                    },
                    overflow: 'hidden',
                    borderRadius: 4,
                    margin: .2
                  }}
                  selected={(page.type.name === "ManageExercise") ? true : false}
                  onClick={() => setPage(<ManageExercise theme={theme} />)}  ><FitnessCenterIcon sx={{ marginRight: 1 }} />{lgUp && `Manage Exercises `}</ListItemButton>
              </Tooltip>

            }
          </ListItem>





          <ListItem disablePadding>
            {state.profile.roles.includes(10) && <Tooltip title="Users" placement='right'>
              <ListItemButton
                id='dashboardBtn'
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: '#3070AF',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#689ee1',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    },

                    '&:hover': {
                      backgroundColor: '#3070AF'
                    },
                    margin: .2

                  },
                  overflow: 'hidden',
                  borderRadius: 4,
                  margin: .2
                }}
                selected={(page.type.name === "Users") ? true : false}

                variant="text"
                onClick={() => setPage(<Users />)} ><PersonIcon sx={{ marginRight: 1 }} />{lgUp && `Manage Users`} </ListItemButton>
            </Tooltip>}
          </ListItem>


          <ListItem disablePadding>
            <Tooltip title="View Workouts" placement='right'>
              <ListItemButton variant="text"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: '#3070AF',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#689ee1',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    },

                    '&:hover': {
                      backgroundColor: '#3070AF'
                    },
                    margin: .2

                  },
                  overflow: 'hidden',
                  borderRadius: 4,
                  margin: .2
                }}
                selected={(page.type.name === "ViewWorkouts") ? true : false}

                onClick={() => setPage(<ViewWorkouts />)} ><FitnessCenterIcon sx={{ marginRight: 1 }} />{lgUp && `View Workouts`} </ListItemButton>
            </Tooltip>
          </ListItem>



          <ListItem disablePadding>
            <Tooltip title="Measurements" placement='right'>
              <ListItemButton variant="text"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: '#3070AF',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#689ee1',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    },

                    '&:hover': {
                      backgroundColor: '#3070AF'
                    },
                    margin: .2

                  },
                  overflow: 'hidden',
                  borderRadius: 4,
                  margin: .2
                }}
                selected={(page.type.name === "Measurements") ? true : false}

                onClick={() => setPage(<Measurements />)} ><StraightenIcon sx={{ marginRight: 1 }} />{lgUp && `Measurements`} </ListItemButton>
            </Tooltip>
          </ListItem>

          <ListItem disablePadding>
            <Tooltip title="Progress Pictures" placement='right'>
              <ListItemButton variant="text"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: '#3070AF',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#689ee1',
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: '#000'
                    },

                    '&:hover': {
                      backgroundColor: '#3070AF'
                    },
                    margin: .2

                  },
                  overflow: 'hidden',
                  borderRadius: 4,
                  margin: .2
                }}
                selected={(page.type.name === "ProgressPics") ? true : false}

                onClick={() => setPage(<ProgressPics />)} ><Photo sx={{ marginRight: 1 }} />{lgUp && `Progress Pictures`} </ListItemButton>
            </Tooltip>
          </ListItem>

        </List>

      </Drawer>

      <Grid  sx={{
        justifyContent: 'center',
        alignItems: 'center',
        

        width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth + 1}px `,
        ...(!lgUp && {
          width: `calc(100% - ${50}px)`, ml: `${55}px `,
        })

      }}
      >


        {page && page}



      </Grid>





    </Container>
  )


}


export default DashBoard;