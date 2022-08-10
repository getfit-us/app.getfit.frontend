import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Divider, Grid, List, ListItem, Rating, TextField, Tooltip, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Edit, Star } from "@mui/icons-material";
import DashBoard from "../Components/DashBoard";


const Profile = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useProfile();
  const [showUpload, setShowUpload] = useState(false);
  const [hover, setHover] = useState(-1);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(state.profile.startDate).toDateString()

  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };


  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }


  const getTrainer = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/trainers/${id}`, { signal: controller.signal });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: 'SET_TRAINER', payload: response.data })
      setLoading(false)


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









  const updateProfileImage = async (e, data) => {
    e.preventDefault();

    const myFiles = document.getElementById('avatar').files
    const formData = new FormData()
    Object.keys(myFiles).forEach(key => {
      formData.append(myFiles.item(key).name, myFiles.item(key))
    })
    let isMounted = true;
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/upload', formData,
        { signal: controller.signal });
      const form = document.getElementById('avatar');
      form.value = ""
      console.log(response.data.message)
      setShowUpload(prev => !prev)

      dispatch({
        type: 'UPDATE_PROFILE_IMAGE', payload: response.data.message
      });

    }

    catch (err) {
      console.log(err);

    }
    return () => {
      isMounted = false;
      controller.abort();

    }

  }

  useEffect(() => {

    if (state.profile.trainerId) getTrainer(state.profile.trainerId);

    if (!state.workouts[0])  {
      
      getWorkouts(state.profile.clientId);
    }

  }, [])


console.log(state.workouts)



  return (
    <Grid container spacing={2} sx={{

      alignItems: 'start',
      justifyContent: 'center',
      marginTop: 0,

      pb: 2

    }}>
         



      <Grid item >
        <Card style={styles.card}>
          <Typography variant="h5" m={3}>Profile Information
            <Tooltip title="Edit Profile" sx={{ marginLeft: 1 }}>
              <Edit />
            </Tooltip>
          </Typography>

          <CardHeader style={styles.heading} avatar={
            <Avatar src={`http://localhost:8000/avatar/${state.profile.avatar}`} style={styles.avatar}>
              {state.profile.firstName && state.profile.firstName[0].toUpperCase()}


            </Avatar>
          }
            title={state.profile.firstName ? state.profile.firstName + " " + state.profile.lastName : " "}
            subheader={`Joined: ${date}`}
          />
          <Divider />
          <CardMedia
            component='img'
            height='400'
            image={`http://localhost:8000/avatar/${state.profile.avatar}`}
            alt='Profile image'
          />
          <CardContent style={styles.statLabel}>

            <p>{state.profile.age && `Age: ${state.profile.age}`}</p>
            <p> {state.profile.phone ? `Phone: ${state.profile.phone}` : `Phone: `}</p>
            <p>{state.profile.email && `email: ${state.profile.email}`}</p>
            <p>{state.profile.trainerId && `Trainer: ${state.trainer.firstname} ${state.trainer.lastname}`}</p>




            <Typography>
              {!showUpload && <Button variant='contained' onClick={() => setShowUpload(prev => !prev)}>Upload Profile Image</Button>}


            </Typography>
            {showUpload && <form id="upload" onSubmit={updateProfileImage} encType="multipart/form-data">

              <Grid container>

                <Grid item margin={2}>
                  <TextField label='Profile image' setFocus InputLabelProps={{ shrink: true }} type='file' fullWidth name='avatar' id='avatar' accept='image/*' multiple>

                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained'>Upload</Button>
                </Grid>

              </Grid>
            </form>}

          </CardContent>

        </Card>
      </Grid>

      <Grid item  >
        <Card style={styles.card} sx={{mb:1}}>
          <CardHeader title="Goals" />





          <CardContent>
            <List sx={{ textAlign: 'center' }}>
              {state.profile.goal.map((goal) => (
                <ListItem key={goal}>
                  {goal}
                </ListItem>


              )



              )}




            </List>

          </CardContent>
        </Card>
     
        <Card style={styles.card}>
          <CardHeader title="Progress" />





          <CardContent>



            <List sx={{ textAlign: 'center' }}>
              <ListItem>
                Last Workout: {state.workouts[0] ?  new Date(state.workouts[0].date.slice(5) + "-" + state.workouts[0].date.slice(0,4)).toDateString()  : ''}
                
              </ListItem>
              <ListItem>
              {state.workouts[0] &&   <Rating
                  name="hover-feedback"
                  value={state.workouts[0].rating}
                  precision={0.5}
                  getLabelText={getLabelText}
                  readOnly
                 
                
                  emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                />}
                {state.workouts[0]  && (
                  <Box sx={{ ml: 2 }}>{labels[state.workouts[0].rating]}</Box>
                )}

              </ListItem>
              <ListItem>
                Type: {state.workouts[0] ? state.workouts[0].workoutType.toUpperCase() : ''}
               <ListItem>  Cardio Completed: {state.workouts[0] &&  <CheckCircle size='large' /> }</ListItem>
              



              </ListItem>
              <ListItem>
                Current Body Weight:


              </ListItem>
              <ListItem>
                Previous Weight:

              </ListItem>
            </List>

          </CardContent>
        </Card>
      </Grid>
    </Grid>





  )
}


const styles = {
  card: {
    borderRadius: 20,
    minWidth: 256,
    textAlign: 'center',
    raised: true,
    backgroundColor: '#f5f0f0'

  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: 8,
    marginBottom: 0,
  },

  statLabel: {
    fontSize: 16,

    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '1px',
  },
}



export default Profile;