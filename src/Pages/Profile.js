import { Avatar, Button, Card, CardContent, CardHeader, CardMedia, Divider, Grid, List, ListItem, TextField, Tooltip, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Edit } from "@mui/icons-material";
import { Container } from "@mui/system";



const Profile = ({ setUser, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [trainer, setTrainer] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  // const [typeUser, setTypeUser] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(auth.startDate).toDateString()

  const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 < date2) {
      console.log(`${d1} is less than ${d2}`);
      return d2;
    } else if (date1 > date2) {
      console.log(`${d1} is greater than ${d2}`);
      return d1;
    } else {
      return "equal";
    }
  };




  const onSubmit = async (e, data) => {
    e.preventDefault();

    const myFiles = document.getElementById('avatar').files

    const formData = new FormData()


    Object.keys(myFiles).forEach(key => {
      formData.append(myFiles.item(key).name, myFiles.item(key))
    })
    let isMounted = true;



    formData.append("id", auth.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/upload', formData,
        { signal: controller.signal });
      const form = document.getElementById('avatar');
      form.value = ""
      console.log(response.data.message)
      setShowUpload(prev => !prev)

      auth.avatar = response.data.message;
      setUser({ avatar: response.data.message });


    }

    catch (err) {
      console.log(err);

    }
    return () => {
      isMounted = false;



      controller.abort();

    }

  }


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
            <Avatar src={`http://localhost:8000/avatar/${auth.avatar}`} style={styles.avatar}>
              {auth.firstName && auth.firstName[0].toUpperCase()}


            </Avatar>
          }
            title={auth.firstName ? auth.firstName + " " + auth.lastName : " "}
            subheader={`Joined: ${date}`}
          />
          <Divider />
          <CardMedia
            component='img'
            height='400'
            image={`http://localhost:8000/avatar/${auth.avatar}`}
            alt='Profile image'
          />
          <CardContent style={styles.statLabel}>

            <p>{auth.age && `Age: ${auth.age}`}</p>
            <p> {auth.phone ? `Phone: ${auth.phone}` : `Phone: `}</p>
            <p>{auth.email && `email: ${auth.email}`}</p>
            <p>{auth.trainerID && `Trainer: Get trainer name`}</p>




            <Typography>
              {!showUpload && <Button variant='contained' onClick={() => setShowUpload(prev => !prev)}>Upload Profile Image</Button>}


            </Typography>
            {showUpload && <form id="upload" onSubmit={onSubmit} encType="multipart/form-data">

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
        <Card style={styles.card} >
          <CardHeader title="Goals" />





          <CardContent>

            {auth.goal}

            <List sx={{ textAlign: 'center' }}>
              <ListItem>
                Weight Loss

              </ListItem>
              <ListItem>
                Muscle Growth

              </ListItem>
              <ListItem>
                Strength

              </ListItem>
            </List>

          </CardContent>
        </Card>
      </Grid>

      <Grid item >
        <Card style={styles.card}>
          <CardHeader title="Progress" />





          <CardContent>

            {auth.goal}

            <List sx={{ textAlign: 'center' }}>
              <ListItem>
                Last Workout:

              </ListItem>
              <ListItem>
                Current Weight:

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