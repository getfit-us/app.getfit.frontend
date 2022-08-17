import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Divider, Grid, List, ListItem, Rating, TextField, Tooltip, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Edit, Star } from "@mui/icons-material";
import Password from './Password';
import MeasurementChart from "../Features/MeasurementChart";
import { useDropzone } from 'react-dropzone';


const Profile = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useProfile();
  const [showUpload, setShowUpload] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState();


  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(state.profile.startDate).toDateString()

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],

    },
    maxFiles: 1,
    onDrop: acceptedFiles => {


      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));

    }

  });

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


    const formData = new FormData()
    if (acceptedFiles) {
      acceptedFiles.map((file) => formData.append(file.name, file))
    }

    let isMounted = true;
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/upload', formData,
        { signal: controller.signal });

      setShowUpload(prev => !prev);
      setFiles();
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

    if (state.profile.trainerId && !state.trainer?.firstname) getTrainer(state.profile.trainerId);

    if (!state.workouts[0]) {

      getWorkouts(state.profile.clientId);
    }


  }, [])

  console.log(state.measurements)




  return (
    <Grid container spacing={2} sx={{

      alignItems: 'start',
      justifyContent: 'center',
      marginTop: 0,
      width: '100%',
      pb: 2

    }}>




      <Grid item sm={4}>
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


          {!showUpload && <CardMedia
            component='img'
            height='400'
            image={`http://localhost:8000/avatar/${state.profile.avatar}`}
            alt='Profile image'
          />}

          {showUpload &&
            <>
              <Grid item xs={12} sx={{ mt: 3, p: 3, border: 2, justifyItems: 'center' }} {...getRootProps({ className: 'dropzone' })} id="dropzone">

                <TextField {...getInputProps()} name='files' id='files' />
                <p style={styles.p} >Drag 'n' drop Profile Picture here</p>
                <p style={styles.p}></p>

                <Grid style={styles.thumbsContainer}>
                  {files && files.map(file => (
                    <Grid style={styles.thumb} key={file.name}>
                      <Grid style={styles.thumbInner}>
                        <img
                          src={file.preview}
                          style={styles.img}
                          alt="File Preview"
                          // Revoke data uri after image is loaded
                          onLoad={() => { URL.revokeObjectURL(file.preview) }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>


            </>}
          <CardContent style={styles.statLabel}>

            {showUpload &&
              <>
                <Grid item xs={2} sx={{ justifyContent: 'center' }}>
                  <Button type='button' onClick={updateProfileImage} size='small' variant='contained'>Upload</Button>
                </Grid>
                <Grid item xs={2}  >
                  <Button type='button' size='small' color='warning' variant='contained' onClick={() => setShowUpload(false)}>Cancel</Button>
                </Grid>
              </>}

            <p>{state.profile.age && `Age: ${state.profile.age}`}</p>
            <p> {state.profile.phone ? `Phone: ${state.profile.phone}` : `Phone: `}</p>
            <p>{state.profile.email && `email: ${state.profile.email}`}</p>
            <p>{state.profile.trainerId && `Trainer: ${state.trainer.firstname} ${state.trainer.lastname}`}</p>




            <Typography sx={{ m: 1 }}>
              {!showUpload && <Button variant='contained' onClick={() => setShowUpload(prev => !prev)}>Upload Profile Image</Button>}


            </Typography>
            <Grid item> <Typography> {!showPassword && <Button variant='contained' onClick={() => setShowPassword(prev => !prev)}>Change Password</Button>}</Typography>

              {showPassword && <Password setShowPassword={setShowPassword} />}</Grid>

          </CardContent>

        </Card>
      </Grid>

      <Grid item sm={4}>
        <Card style={styles.card} sx={{ mb: 1 }}>
          <CardHeader title="Goals" />





          <CardContent sx={{ textAlign: 'center', justifyContent: 'center' }}>
            <List >
              {state.profile.goal.map((goal) => (
                <ListItem sx={{ textAlign: 'center' }} key={goal}>
                  {goal}
                </ListItem>


              )



              )}




            </List>

          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Progress" />





          <CardContent sx={{ justifyContent: 'center' }}>



            <List sx={{ textAlign: 'center' }}>
              <ListItem>
                Last Workout: {state.workouts[0] ? new Date(state.workouts[0].date.slice(5) + "-" + state.workouts[0].date.slice(0, 4)).toDateString() : ''}

              </ListItem>
              <ListItem>
                {state.workouts[0] && <Rating
                  name="hover-feedback"
                  value={state.workouts[0].rating}
                  precision={0.5}
                  getLabelText={getLabelText}
                  readOnly


                  emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                />}
                {state.workouts[0] && (
                  <Box sx={{ ml: 2 }}>{labels[state.workouts[0].rating]}</Box>
                )}

              </ListItem>
              <ListItem>
                Type: {state.workouts[0] ? state.workouts[0].type.toUpperCase() : ''}
                <ListItem>  Cardio Completed: {state.workouts[0] && <CheckCircle size='large' />}</ListItem>




              </ListItem>
              <ListItem>
                Current Body Weight: {state.measurements[0] && state.measurements[0].weight}


              </ListItem>
              <ListItem>
                Previous Weight: {state.measurements[1] && state.measurements[1].weight}

              </ListItem>
              <ListItem>
                Starting Weight: {state.measurements[1] && state.measurements[state.measurements.length - 1].weight}

              </ListItem>
            </List>

          </CardContent>
        </Card>
      </Grid>
      <Grid item sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Card style={styles.card}>
          <MeasurementChart width={400} />

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
    backgroundColor: '#E4E7E7'

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
  }, thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },

  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  },

  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },

  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  },

}



export default Profile;