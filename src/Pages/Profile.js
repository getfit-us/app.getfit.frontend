import { Avatar, Button, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useState, useEffect } from "react";
import { CardBody } from "reactstrap";
import UploadImg from "../Components/UploadImg";
import {Link} from 'react-router-dom'


const Profile = () => {

  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [trainer, setTrainer] = useState({});
  const [showUpload ,setShowUpload] = useState(false);
  // const [typeUser, setTypeUser] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date().toLocaleDateString('en-US');

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



  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const controller = new AbortController();
   

    const getTrainer = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${user.trainerId}`, { signal: controller.signal });
        // console.log(response.data);
        isMounted && setTrainer(response.data);
        setLoading(false)


      }
      catch (err) {
        console.log(err);
        setError(err);
        //save last page so they return back to page before re auth. 
        // navigate('/login', {state: {from: location}, replace: true});
      }
    }

    
    
    if (auth.roles.includes(2)) {
      getTrainer(auth.trainerId);
      
    }


    

    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [])




  return (
    <Grid container sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5

    }}>
     

        <Grid item>
          <Card sx={{ maxWidth: 345 }}>
          <Grid item>
        <Typography variant="h3" m={3}>Profile</Typography>
        <Typography>


        </Typography>
        </Grid>
            <CardHeader avatar={
              <Avatar>
                {auth.firstName && auth.firstName[0].toUpperCase()}


              </Avatar>
            }
              title={auth.firstName ? auth.firstName + " " + auth.lastName : "Not Found"}
              subheader={`Joined: ${auth.date}`}
            />
            <CardMedia
              component='img'
              height='200'
              image={auth.avatar_url}
              alt='auth image'
            />
            <CardContent>
              <Grid item variant="body" color="text.secondary">
                <p>{auth.age && `Age: ${auth.age}`}</p>
                <p> {auth.phone ? `Phone Number: ${auth.phone}` : `Phone Number: `}</p>
                <p>{auth.email && `email: ${auth.email}` }</p>
                {auth.goal && <p>  Goals: {auth.goal}</p>}


              </Grid>
              <Grid item>
                <Typography>
                  
                  <Button onClick={() => setShowUpload(prev => !prev)}>Upload Image</Button>
                 
                </Typography>
                {showUpload && <UploadImg clientId={auth.clientId}/>}
              </Grid>
            </CardContent>

          </Card>
        </Grid>
        {/* <Grid item>
          <Card>
            <CardHeader>
            

            </CardHeader>

            <CardBody>
           
            </CardBody>
          </Card>
        </Grid> */}
      </Grid>
  )
}

export default Profile;