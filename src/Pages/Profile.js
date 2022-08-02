import { Grid, Typography } from "@mui/material";
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useState, useEffect } from "react";



const Profile = () => {

  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [client, setClient] = useState({});

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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
        // console.log(response.data);
        isMounted && setClient(response.data);
        setLoading(false)


      }
      catch (err) {
        console.log(err);
        setError(err);
        //save last page so they return back to page before re auth. 
        // navigate('/login', {state: {from: location}, replace: true});
      }
    }


    if (auth.roles.includes(2)) getClient();
    else getUser();


    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [])



  //grab current user/ client info 



  return (
    <Grid container sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'

    }}>
      <Grid item>
        <Typography variant="h3" m={3}>Profile</Typography>
        <Typography>
          {client && client.firstname}
          {client && client.lastname}

          {user && user.firstname}
          {user && user.lastname}

        </Typography>


      </Grid>
    </Grid>
  )
}

export default Profile