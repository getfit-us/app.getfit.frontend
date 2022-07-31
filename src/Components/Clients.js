// list all clients 
import { Button, TextField, MenuItem, Typography, Grid, Paper, Avatar, Fab, CircularProgress } from "@mui/material";
import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';





const Clients = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [reloadClients, setReloadClients] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const watchClients = watch(['cur_client', 'firstname']);
    let values = getValues();



    const columns = useMemo(() => [
        { field: "_id", hide: true },
        {
            field: "avatar_url", headerName: "Avatar", renderCell: (params) => {

                return (
                    <Avatar src={params.row.avatar_url} >{params.row.firstname[0].toUpperCase()} </Avatar>)
            },

            sortable: false,
            filterable: false
        },
        { field: "firstname", headerName: "First Name", width: 120, editable: true },
        { field: "lastname", headerName: "Last Name", width: 130, editable: true },
        { field: "email", headerName: "Email", width: 200, editable: true },
        { field: "phone", headerName: "Phone Number", width: 130, editable: true },
        { field: "age", headerName: "Age", width: 70, editable: true, type: 'number' },
        {
            field: "dalete", headerName: "Delete", width: 70, height: 90, renderCell: (params) => {
               
                    return (

                        <>
    
                            <Fab aria-label="add" color='warning' size="small">
                                <DeleteIcon onClick={() => onDelete(params.row._id)} />
                                {loading && <CircularProgress />}
                            </Fab>
                        </>
                    )
                

             
            }
        },
        {
            field: "modify", headerName: "Modify", width: 70, renderCell: (params) => {
                return (
                    <>
                        <Fab aria-label="add" color='secondary' size="small">
                            <SaveIcon onClick={() => onUpdate(params.row)} />
                        </Fab>
                    </>
                )
            }
        }



    ], []);



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

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/clients', data, { signal: controller.signal });
            // console.log(response.data);
            setReloadClients(true);
            reset();
            setLoading(false)
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }

 

    const onDelete = async (id) => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.delete(`/clients/${id}`, { signal: controller.signal });
            //   console.log(response.data);
            setReloadClients(true);
            reset();
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }

    const onUpdate = async (data) => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        setLoading(true);

        console.log(data);
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.put('/clients', data, { signal: controller.signal });
            //   console.log(response.data);
            setReloadClients(true);
            reset();
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }
    // Update to DataGrid component

    return (

        <Paper  >

            <Grid container mt={3} justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='h4' >Clients </Typography>
                </Grid>
                <Grid item xs={12}>
                {error && <p>{error}</p>}
                {loading && <CircularProgress />}

                {clients && <DataGrid
                    rows={clients}
                    columns={columns}
                    rowsPerPageOptions={[5, 10, 20]}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    checkboxSelection
                    getRowId={(clients) => clients._id}
                    getRowSpacing={params => ({
                        top: params.isFirstVisible ? 0 : 5,
                        bottom: params.isLastVisible ? 0 : 5
                    })}
                    autoHeight
                    sx={{ mt: 2, mb: 2 }}
                />}
                </Grid>
            </Grid>

            <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} autoComplete='false'>
                <Grid container spacing={1} justifyContent='center' alignItems='center' >


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
                        <TextField {...register("age")} name="age" type='text' label='Age' fullWidth />

                    </Grid>





                    <Grid item xs={12} mb={3}>
                        <Button variant="contained" type='submit' mb={3}>ADD CLIENT</Button>

                    </Grid>


                </Grid>

            </form >

            <DevTool control={control} />


        </Paper >


    )
}








const styles = {



}










export default Clients;