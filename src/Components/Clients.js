// list all clients 
import { Button, TextField, MenuItem, Typography, Grid, Paper } from "@mui/material";
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";




const Clients = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState();
    const [reloadClients, setReloadClients] = useState(false);
    const [CurClient, setCurClient] = useState();

    const axiosPrivate = useAxiosPrivate();


    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const watchClients = watch(['cur_client', 'firstname']);
    let values = getValues();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();

        const getClients = async () => {
            try {
                const response = await axiosPrivate.get('/clients', { signal: controller.signal });
                // console.log(response.data);
                isMounted && setClients(response.data);
                setLoading(false)
                setReloadClients(false)

            }
            catch (err) {
                console.log(err);
                setError(err);
                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getClients();
        return () => {
            isMounted = false;
            controller.abort();
        }

    }, [reloadClients])


    const onSubmit = async (data) => {
        let isMounted = true;
        console.log(data);

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/clients', data, { signal: controller.signal });
            console.log(response.data);

            setReloadClients(true);
            reset();

        }
        catch (err) {
            console.log(err);

        }
        return () => {
            isMounted = false;


            controller.abort();
        }

    }


    const handleChange = (values) => {
        const cur_client = clients.filter(client => client._id === values.target.value);

        if (cur_client) {
            setValue('cur_firstname', cur_client['0'].firstname)
            setValue('cur_lastname', cur_client['0'].lastname)
            setValue('cur_email', cur_client['0'].email)
            setValue('cur_phone', cur_client['0'].phone)

        } else {
            setCurClient('');

        }
    }



    const onDelete = async () => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        const data = getValues()
        console.log(data);
        const controller = new AbortController();
        try {
          const response = await axiosPrivate.delete(`/clients/${data.cur_client}`, { signal: controller.signal });
          console.log(response.data);

        setReloadClients(true);
        reset();

        }
        catch (err) {
          console.log(err);
    
        }
        return () => {
          isMounted = false;
    
    
          controller.abort();
        }
    
      }

      const onUpdate = async () => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        const data = getValues()
        console.log(data);
        
        const controller = new AbortController();
        try {
          const response = await axiosPrivate.put('/clients', data ,{ signal: controller.signal });
          console.log(response.data);

        setReloadClients(true);
        reset();

        }
        catch (err) {
          console.log(err);
    
        }
        return () => {
          isMounted = false;
    
    
          controller.abort();
        }
    
      }
    // make layout with list of clients , form for adding and deleting clients 





    return (

        <Paper>

            <Grid container mt={3} justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='h4' >Clients </Typography>
                </Grid>
                {error && <p>{error}</p>}
                {loading && <p>Loading...</p>}

                

            </Grid>

            <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} autoComplete='false'>
                <Grid container spacing={1} justifyContent='center' alignItems='center'>

                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField {...register("cur_client")} name="cur_client" label='Current Clients' select fullWidth defaultValue='' onChange={handleChange}>

                            <MenuItem value="" >Select a Client</MenuItem>

                            {loading && <MenuItem>Loading...</MenuItem>}
                            {error && <MenuItem>Error could not read client list</MenuItem>}

                            {clients && clients.map((client) => {





                                return (

                                    <MenuItem key={client._id} value={client._id}>
                                        {`${client.firstname} ${client.lastname} `}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                    </Grid>

                    <Grid item >
                        <Button variant="contained" onClick={onDelete}>Delete Selected Client</Button>
                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="h4">Modify Client Info</Typography>
                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_firstname")} InputLabelProps={{ shrink: true }} name="cur_firstname" label='Modify First Name' fullWidth  />

                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_lastname")} name="cur_lastname" InputLabelProps={{ shrink: true }} label='Modify Last Name' fullWidth  />

                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_email")} name="cur_email" InputLabelProps={{ shrink: true }} type='email' label='Modify Email' fullWidth  />

                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_phone")} name="cur_phone" InputLabelProps={{ shrink: true }} type='phone' label='Modify phone' fullWidth />

                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_password")} name="cur_password" type='password' label='Modify Password' fullWidth />

                    </Grid>

                    <Grid item>
                        <TextField {...register("cur_password2")} name="cur_password2" type='password' label='Confirm Password' fullWidth />

                    </Grid>
                    <Grid item>
                        <Button variant='contained' onClick={onUpdate}>Submit Changes</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant='h4'>Add Client</Typography>
                    </Grid>
                    <Grid item>
                        <TextField {...register("firstname")} name="firstname" type='text' label='Client First Name' fullWidth />

                    </Grid>

                    <Grid item>
                        <TextField {...register("lastname")} name="lastname" type='text' label='Client Last Name' fullWidth />

                    </Grid>

                    <Grid item>
                        <TextField {...register("email")} name="email" type='email' label='Email' fullWidth />

                    </Grid>
                    <Grid item>
                        <TextField {...register("phone")} name="phone" type='phone' label='Phone' fullWidth />

                    </Grid>




                    <Grid item>
                        <Button variant="contained" type='submit'>ADD CLIENT</Button>

                    </Grid>


                </Grid>

            </form>

            <DevTool control={control} />


        </Paper >


    )
}


















export default Clients;