
import { CircularProgress, Grid, Fab, Paper, Modal, Backdrop, Fade, Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import MonitorIcon from '@mui/icons-material/Monitor';


// Going to display workouts here



const WorkoutLists = () => {
    const [workouts, setWorkouts] = useState({});
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [curRow, setCurRow] = useState({});
    const [curClient, setCurClient] = useState=({});
    const handleModal = () => setOpen(prev => !prev);
    const axiosPrivate = useAxiosPrivate();
    const [pageSize, setPageSize] = useState(10);

    const onDelete = async (id) => {
        // if (!values.deleteExercise.checked  )  return false; 
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.delete(`/workouts/${id}`, { signal: controller.signal });
            //   console.log(response.data);
            setLoading(false);
            setWorkouts(workouts.filter((workout) => workout._id !== id));
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


        const controller = new AbortController();
        try {
            const response = await axiosPrivate.put('/workouts', data, { signal: controller.signal });
            // console.log(response.data);
            const updatedWorkouts = workouts.map(workout => workout._id === response.data._id ? response.data : workout)
            setWorkouts(updatedWorkouts);

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



    const columns = useMemo(() => [
        { field: "_id", hide: true },
        {
            field: "clientId", headerName: "Client Name", width: 120, renderCell: (params) => {
                { loading && <CircularProgress /> }
                {users && setCurClient(users.filter((user) => user._id === params.row.clientId));}
                return (
                    <>
                        {curClient[0].firstname} {curClient[0].lastname}
                    </>
                )



            }
        },
        { field: "workoutType", headerName: "Workout Type", width: 120 },
        { field: "date", headerName: "Date", width: 120 },
        {
            field: "exercises", headerName: "View", width: 120, renderCell: (params) => {
                
                setCurRow(params.row);
                return (
                    <>
                        <Fab aria-label="add" color='#47412f' size="small">
                            <MonitorIcon onClick={(params) => {

                                handleModal();
                            }
                            } />
                        </Fab>
                    </>
                )

            }
        },
        { field: "cardio", headerName: "Cardio", width: 130, editable: true },
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



    ], [workouts, users]);


    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();
        const getWorkouts = async () => {
            try {
                const response = await axiosPrivate.get('/workouts', { signal: controller.signal });
                isMounted && setWorkouts(response.data);
                setLoading(false)
            }
            catch (err) {
                console.log(err);
                setError(err);

                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', { signal: controller.signal });
                // console.log(response.data);
                isMounted && setUsers(response.data);
                setLoading(false)


            }
            catch (err) {
                console.log(err);
                setError(err);
                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }
      
        getUsers();
        getWorkouts();
        return () => {
            isMounted = false;
            setLoading(false);

            controller.abort();
        }

    }, [])

    return (
        <Paper elevation={2} >
            <Grid container mt={2}>
                <Grid item xs={12}>
                    {loading && <CircularProgress />}
                    {workouts && users && <DataGrid
                        rows={workouts}
                        columns={columns}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        checkboxSelection
                        getRowId={(users) => users._id}
                        getRowSpacing={params => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5
                        })}
                        autoHeight
                        sx={{ mt: 2, mb: 2 }}
                    />}
                </Grid>

            </Grid>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Grid container sx={style.modal}>

                        <Typography>Workout Log</Typography>
                        <Grid item><Typography>Date: {curRow.date}  Workout Type: {curRow.workoutType}</Typography></Grid>

                        <Grid item>
                            <Typography>{}</Typography>
                        


                            
                            
                            

                            
                            
                        



                        </Grid>



                    </Grid>
                </Fade>
            </Modal>

        </Paper>
    );
};

const style = {

    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    }
};


export default WorkoutLists;