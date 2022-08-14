import { useMemo, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { Box, Fab, Fade, Grid, Modal, Rating, Typography, Backdrop, Paper, CircularProgress, Button, Tooltip } from '@mui/material';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { CheckCircle, CheckCircleOutline, Close, Edit, Preview, Star } from "@mui/icons-material";
import { Container } from '@mui/system';


const ViewWorkouts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [rowId, setRowId] = useState(null);
    const [rowParams, setRowParams] = useState(null);


    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    const handleModal = () => setOpen(prev => !prev);

    const detailsRows = state.workouts.map((workout) => {
        return {
            id: workout._id,
            date: workout.date,
            type: workout.type,
            rating: workout.rating,
            exercises: workout.exercises,
            cardio: workout.cardio
        }
    });

    const isObject = (val) => {
        if (val === null) {
            return false;
        }

        return typeof val === 'object';
    };

    const nestedObject = (obj) => {
        for (const key in obj) {
            if (isObject(obj[key])) {
                for (const innerKey in obj[key]) {
                    console.log(`${innerKey} => ${obj[key][innerKey]}`);
                }
            } else {
                console.log(`${key} => ${obj[key]}`);
            }
        }
    };

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
        { field: "type", headerName: "Type", width: 120 },
        {
            field: "cardio Length", headerName: "Cardio Length", width: 130, renderCell: (params) => {
                return params.row.cardio.length
            }
        },
        {
            field: "cardio", headerName: "Cardio", width: 90, renderCell: (params) => {

                if (params.row.cardio?.completed) { return <Tooltip title="Completed"><CheckCircle /></Tooltip> } else {
                    return <Tooltip title='No Cardio'><CheckCircleOutline /></Tooltip>
                }
            }
        },
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
                // setRowParams(params.row);


                return (

                    <>  <Tooltip title='View' placement='right'>
                        <Fab size='small' onClick={(params) => {
                            console.log(rowParams.exercises)

                            handleModal()
                        }
                        }>
                            <Preview />
                        </Fab>
                    </Tooltip>





                    </>




                )


            }
        }






    ], []);

    // console.log(state.workouts)


    return (

        <Paper elevation={2} >

            {rowParams && <Modal
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
                                <Typography id="transition-modal-title" variant="h4" component="h4" xs={12}>
                                     {new Date(rowParams?.date.slice(5) + "-" + rowParams?.date.slice(0, 4)).toDateString()}
                                </Typography>

                                <Grid item xs={12} sm={12} lg={12} mt={5}>
                                    {rowParams.exercises.map(exercise => {
                                        for (const property in exercise) {
                                            console.log(`${property}: ${exercise[property]}`);
                                          }
                                        return (
                                            <>
                                                <Grid item xs={6} >
                                                    <Typography variant='p'>  {Object.keys(exercise)}</Typography>
                                              
                                                </Grid>
                                                <Grid item xs={6}   >

                                                </Grid>
                                                <Grid item xs={12}   >
                                                </Grid>
                                            </>

                                        )


                                    }
                                    )}





                                    <Button onClick={handleModal} color="warning" variant="contained" size='large' sx={{ mt: 3, mb: 2 }} endIcon={<Close />} fullWidth>Close</Button>
                                </Grid>






                            </Grid>
                        </form>
                    </Box>
                </Fade>
            </Modal>}

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
                        onCellClick={(params) => setRowParams(params.row)}
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
        border: '2px solid #474a48',
        boxShadow: 24,
        p: 4,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    }
};

export default ViewWorkouts