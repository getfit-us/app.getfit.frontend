import { Avatar, Button, Card, CardContent, CardHeader, CardMedia, Grid, TextField, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useState, useEffect } from "react";
import { CardBody } from "reactstrap";
import { Link, useNavigate, useLocation } from 'react-router-dom'


const Profile = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
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
      setUser({avatar: response.data.message});


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
    <Grid container sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5

    }}>


      <Grid item xs={6}>
        <Card sx={{ maxWidth: 345 }}>
          <Grid item>
            <Typography variant="h3" m={3}>Profile</Typography>
            <Typography>


            </Typography>
          </Grid>
          <CardHeader avatar={
            <Avatar src={`http://localhost:8000/avatar/${auth.avatar}`}>
              {auth.firstName && auth.firstName[0].toUpperCase()}


            </Avatar>
          }
            title={auth.firstName ? auth.firstName + " " + auth.lastName : " "}
            subheader={`Joined: ${date}`}
          />
          <CardMedia
            component='img'
            height='400'
            image={`http://localhost:8000/avatar/${auth.avatar}`}
            alt='Profile image'
          />
          <CardContent>
            <Grid item variant="body" color="text.secondary">
              <p>{auth.age && `Age: ${auth.age}`}</p>
              <p> {auth.phone ? `Phone Number: ${auth.phone}` : `Phone Number: `}</p>
              <p>{auth.email && `email: ${auth.email}`}</p>
             


            </Grid>
            <Grid item>
              <Typography>
                {!showUpload && <Button variant='contained' onClick={() => setShowUpload(prev => !prev)}>Upload Profile Image</Button>}


              </Typography>
              {showUpload && <form id="upload" onSubmit={onSubmit} encType="multipart/form-data">

                <Grid container>

                  <Grid item margin={2}>
                    <TextField label='Profile image' InputLabelProps={{ shrink: true }} type='file' fullWidth name='avatar' id='avatar' accept='image/*' multiple>

                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type='submit' variant='contained'>Upload</Button>
                  </Grid>

                </Grid>
              </form>}
            </Grid>
          </CardContent>

        </Card>
      </Grid>
      <Grid item xs={12}>
          <Card>
            <CardHeader title={`Goals: ${auth.goal}`}/>
             
            

         

            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>

            </CardContent>
          </Card>
        </Grid>
    </Grid>
  )
}

export default Profile;