import { Avatar, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useState, useEffect } from "react";



const Profile = () => {

  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [client, setClient] = useState({});
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
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${auth.clientId}`, { signal: controller.signal });
        // console.log(response.data);
        isMounted && setUser(response.data);
        setLoading(false)


      }
      catch (err) {
        console.log(err);
        setError(err);
        //save last page so they return back to page before re auth. 
        // navigate('/login', {state: {from: location}, replace: true});
      }
    }

    const getClient = async () => {
      try {
        const response = await axiosPrivate.get(`/clients/${auth.clientId}`, { signal: controller.signal });
        console.log(response.data);
        setClient(response.data);
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
      getClient();



    } else {
      getUser();


    }

    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [])



  //grab current user/ client info 

  // console.log(user)

  return (
    <Grid container sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'

    }}>
      <Grid item>
        <Typography variant="h3" m={3}>Profile</Typography>
        <Typography>


        </Typography>

        <Grid item>
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader avatar={
              <Avatar>
                {user.firstname && user.firstname[0].toUpperCase()}
                {client.firstname && client.firstname[0].toUpperCase()}


              </Avatar>
            }
              title={user.firstname ? user.firstname + " " + user.lastname : client.firstname + " " + client.lastname}
              subheader={date}
            />
            <CardMedia
              component='img'
              height='200'
              image={user.avatar_url ? user.avatar_url : client.avatar_url}
              alt='User image'
            />
            <CardContent>
              <Grid item variant="body" color="text.secondary">
                <p>{client.age && `Age: ${client.age}`}</p>
                <p> {user.phone ? `Phone Number: ${user.phone}` : `Phone Number: ${client.phone}`}</p>
                <p>{user.email ? `email: ${user.email}` : `email: ${client.email}`}</p>
                {client.goal && <p>  `Goals: ${client.goal}` </p>}

              </Grid>
              <Grid item>
                <Typography>
                  {}
                </Typography>
              </Grid>
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile;