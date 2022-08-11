import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { Typography, TextField, Grid, MenuItem, Button, Paper, Checkbox, FormGroup, FormControlLabel, Rating, Box } from '@mui/material';
import { CheckCircle, Edit, Star } from "@mui/icons-material";

import { DevTool } from "@hookform/devtools";
import useAuth from '../utils/useAuth';



const drawerWidth = 200;

const AddWorkoutForm = () => {
    const [exercises, setExercises] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [ratingValue, setRatingValue] = useState(4);
    const [hover, setHover] = useState(-1);
    const [showCardioLength, setShowCardioLength] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();

    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const WatchExerciseType = watch('WorkoutType');
    let values = getValues();
    let Reps = Array.from(Array(41).keys());
    const [NumberFields, setNumberFields] = useState([1, 2, 3, 4]);

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
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();
        //get list of exercises
        const getExercise = async () => {
            try {
                const response = await axiosPrivate.get('/exercises', { signal: controller.signal });
                isMounted && setExercises(response.data);
                setLoading(false)
            }
            catch (err) {
                console.log(err);
                setError(err);

                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getExercise();
        return () => {
            isMounted = false;
            setLoading(false);

            controller.abort();
        }

    }, [])


    const onSubmit = async (data) => {
        let isMounted = true;
        //add logged in user id to data
        data.id = state.profile.clientId;
        data.rating = ratingValue;

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/workouts', data, { signal: controller.signal });
            // console.log(response.data);
            dispatch({ type: 'ADD_WORKOUT', payload: response.data })

        }
        catch (err) {
            console.log(err);

        }
        return () => {
            isMounted = false;


            controller.abort();
        }

    }





    return (
        <>

            <Paper elevation={2} sx={{ borderRadius: 4, mb: 4 }}>
                <Grid item xs={12} sm={6} md={6} alignItems='center' justifyContent='center' mt={3} mb={3}>
                    <Typography variant="h4" sx={{ m: 2 }}>Log Workout </Typography>
                </Grid>



                <form noValidate onSubmit={(handleSubmit(onSubmit))} >

                    <Grid container spacing={1} alignItems='center' justifyContent='center'>

                        <Grid item xs={3} sm={3} >

                            <TextField  {...register("date")} InputLabelProps={{ shrink: true, required: true }} type='date' name='date' label="Workout Date" placeholder='' />

                        </Grid>
                        <Grid item xs={6} sm={6} >

                            <FormControlLabel  {...register("cardio")} control={<Checkbox />} label="Cardio" onChange={() => setShowCardioLength(prev => !prev)} />
                            {showCardioLength ? <TextField {...register('length')} type='number' label='Cardio Length (Min)' input /> : ""}


                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField {...register("WorkoutType")} name="WorkoutType" select label="Exercise Type" fullWidth defaultValue="push">
                                <MenuItem value="push">Push</MenuItem>
                                <MenuItem value="pull">Pull</MenuItem>
                                <MenuItem value="legs">Legs</MenuItem>
                            </TextField>
                        </Grid>




                        {/* modify form to select exercise and then show sets */}
                        {/* add map to dynamically add additional Inputs*/}

                        {
                            NumberFields.map((num, index) => {

                                return (
                                    <Grid container spacing={1} alignItems='center' justifyContent='center' margin={1}>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField {...register(`Exercise${num}`)} name={`Exercise${num}`} placeholder='Exercise' label="Exercise" select fullWidth defaultValue="null">
                                                <MenuItem value="null">Choose Exercise.....</MenuItem>
                                                {loading && <MenuItem>Loading...</MenuItem>}
                                                {error && <MenuItem>Error could not read exercise list</MenuItem>}

                                                {exercises && exercises.filter(exercise => exercise.type === values.WorkoutType).map((exercise) => {





                                                    return (
                                                        <MenuItem md='5' className='m-4' key={exercise._id} value={exercise.name}>
                                                            {exercise.name}
                                                        </MenuItem>
                                                    )
                                                })}



                                            </TextField>
                                        </Grid>




                                        <Grid item xs={4} sm={6} md={3}>
                                            <TextField className="form-control" name={`Weight${num}`} placeholder='Weight' type='number' label='Load (lbs)' {...register(`Weight${num}`)} />




                                        </Grid>

                                        <Grid item xs={4} sm={6} md={3}>
                                            <TextField {...register(`Reps${num}`)} className="form-control" name={`Reps${num}`} placeholder='Reps' label='Reps' type='number' defaultValue="null">
                                                

                                          

                                            </TextField>

                                        </Grid>

                                        <Grid item xs={4} sm={6} md={2}>

                                            <TextField {...register(`Sets${num}`)} className="form-control" name={`Sets${num}`} label='Set' placeholder='Sets' type='number' defaultValue="1">
                                              

                                            </TextField>
                                        </Grid>
                                    </Grid>

                                )
                            })}




                        <Grid item xs={12}> 
                        <Typography>Workout Rating</Typography>
                        <Rating
                            name="hover-feedback"
                            value={ratingValue}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, ratingValue) => {
                                setRatingValue(ratingValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                            {ratingValue !== null && (
                                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : ratingValue]}</Box>
                            )}</Grid>



                        <Grid item> <Button type='button' variant='contained' onClick={() => setNumberFields(
                            previousNumberFields =>
                                [...previousNumberFields, previousNumberFields.length + 1]



                        )} color='primary' >

                            Add Exercise
                        </Button></Grid>






                        <Grid item>  <Button type='submit' variant='contained' color='primary' >

                            Log Workout
                        </Button></Grid>


                        <DevTool control={control} />

                    </Grid>
                </ form>


            </Paper>
        </>



    )

}



export default AddWorkoutForm;