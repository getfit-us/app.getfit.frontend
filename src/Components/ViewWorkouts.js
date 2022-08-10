import { useMemo, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { Box, Fab, Fade, Grid, Modal, Rating, Typography, Backdrop, Paper, CircularProgress, Button } from '@mui/material';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { CheckCircle, Close, Edit, Preview, Star } from "@mui/icons-material";


const ViewWorkouts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [rowId, setRowId] = useState(null);


    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    const handleModal = () => setOpen(prev => !prev);

    const detailsRows = state.workouts.map((workout) => {
        return {
          id: workout._id,
          date: workout.date,
          workoutType: workout.workoutType,
          rating: workout.rating,
          exercises: workout.exercises
        }
    });

    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }






    useEffect(() => {



        // const getWorkouts = async (id) => {
        //     //grab all workouts for current client
        //     let isMounted = true;
        //     setLoading(true);

        //     const controller = new AbortController();
        //     try {
        //         const response = await axiosPrivate.get(`/workouts/client/${id}`, { signal: controller.signal });
        //         // console.log(JSON.stringify(response.data));
        //         dispatch({ type: 'SET_WORKOUTS', payload: response.data })
        //         setLoading(false)


        //         // console.log(state.workouts)

        //     }
        //     catch (err) {
        //         console.log(err);
        //         setError(err);
        //         //save last page so they return back to page before re auth. 
        //         // navigate('/login', {state: {from: location}, replace: true});
        //     }
        //     return () => {
        //         controller.abort();

        //     }
        // }

        // getWorkouts(state.profile.clientId);




    }, [])



    const columns = useMemo(() => [
        { field: "_id", hide: true },

        {
            field: "date", headerName: "Date", width: 170, renderCell: (params) => new Date(params.row.date.slice(5) + "-" + params.row.date.slice(0, 4)).toDateString()
        },
        { field: "workoutType", headerName: "Type", width: 120 },
        { field: "cardio.length", headerName: "Cardio Length", width: 130, },
        { field: "cardio.completed", headerName: "Cardio", width: 90, renderCell: (params) => {
            
            if (params.row.exercises.cardio) return <CheckCircle/>
        } },
        {
            field: "rating", headerName: "Workout Rating", width: 130, renderCell: (params) => {
                return (
                    <>
                        <Rating
                            name="hover-feedback"
                            value={params.row.rating}
                            precision={0.5}
                            getLabelText={getLabelText}
                            readOnly


                            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                    </>
                )
            }
        },
        {
            field: 'exercises', headerName: 'Exercises', width: 90, renderCell: (params) => {

                return (

                    <>
                        <Fab size='small' onClick={handleModal
                            }>
                            <Preview/>
                        </Fab>

                       
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
                                <Box sx={style.modal}>

                                    


                                    <form sx={{ mt: 1 }}>
                                        <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography id="transition-modal-title" variant="h4" component="h2" xs={12}>
                                                Workout: {new Date(params.row.date.slice(5) + "-" + params.row.date.slice(0, 4)).toDateString()}  </Typography>

                                            <Grid item xs={12} sm={12} lg={12} mt={5}>

                                            </Grid>



                                            <Grid item xs={12} >


                                            </Grid>
                                            <Grid item xs={12}   >
                                            </Grid>
                                            <Grid item xs={12}   >
                                            <Button onClick={handleModal} color="warning" variant="contained" size='large' sx={{ mt: 3, mb: 2 }} endIcon={<Close />} fullWidth>Close</Button>
                                            </Grid>






                                        </Grid>
                                    </form>
                                </Box>
                            </Fade>
                        </Modal>




                    </>




                )


            }
        }






    ], []);

    // console.log(state.workouts)


    return (

        <Paper elevation={2} >
            <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={3}
                alignItems='center' justifyContent='center'
            >

                <Grid item xs={12}>
                    {error && <p>{error}</p>}
                    {loading && <CircularProgress />}

                    {state.workouts[0] && <DataGrid
                        rows={detailsRows}
                        columns={columns}
                        checkboxSelection={false}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        onCellEditCommit={(params) => setRowId(params.id)}
                        // getRowId={(row) => row.id}
                        getRowSpacing={params => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5,
                        })}
                        autoHeight
                        sx={{ mt: 2, mb: 2 }}
                    />}



                        

                </Grid>

            </Grid>

        </Paper>

    )
}

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

export default ViewWorkouts