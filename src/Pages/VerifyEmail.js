import { Button, Grid } from '@mui/material'
import { useEffect } from 'react'
import {useState} from 'react'
import Missing from './Missing'

const VerifyEmail = () => {
    const [validUrl, setValidUrl] = useState(false)

    useEffect(() => {
        // need to call axios backend to validate email address
        const VerifyEmail = async () => {
            try {   }
            catch (e) { console.log(e) }   

        }

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