import { Button, Grid } from '@mui/material'
import { useEffect } from 'react'
import {useState} from 'react'
import Missing from './Missing'
import axios from "../utils/axios";

const VerifyEmail = () => {
    const [validUrl, setValidUrl] = useState(false)

    useEffect(() => {
        // need to call axios backend to validate email address
        const confirmEmail = async () => {
            try {
                const response = await axios.post("/login", data, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                  });

               }
            catch (e) { console.log(e) }   

        }



        confirmEmail();

    })


   return (
<>
{validUrl ? (
     <Grid container>
        <Grid item xs={12}>
            <h1>Email verified SuccessFully</h1>
        </Grid>
        <Button to="/login" variant="contained" color="success" >Login</Button>
     </Grid> ) :  <Missing error={true}/> }


</>
  )
}

export default VerifyEmail