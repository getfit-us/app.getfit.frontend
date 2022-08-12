import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { Typography, TextField, Grid, MenuItem, Button, Paper, Checkbox, FormGroup, FormControlLabel, Rating, Box } from '@mui/material';
import { Add, CheckCircle, Edit, Save, Star } from "@mui/icons-material";

import { DevTool } from "@hookform/devtools";




const AddWorkoutForm = () => {
    const [exercises, setExercises] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [ratingValue, setRatingValue] = useState(4);
    const [hover, setHover] = useState(-1);
    const [showCardioLength, setShowCardioLength] = useState(false);
    const [showSets, setShowSets] = useState(true);
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    let exerciseNum = 1;
    let workoutlog = []
    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const WatchExerciseType = watch('WorkoutType');
    let values = getValues();
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

    //form need to be split into multiple forms 

    {/* <Grid item xs={6} sm={6} >

<FormControlLabel  {...register("cardio")} control={<Checkbox />} label="Cardio" onChange={() => setShowCardioLength(prev => !prev)} />
{showCardioLength ? <TextField {...register('length')} type='number' label='Cardio Length (Min)' input /> : ""}


</Grid>
< Grid item xs={12}>
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



*/}




    return (
        <>

            <Paper elevation={2} sx={{ borderRadius: 4, mb: 4 }}>
                <Grid item xs={12} sm={6} md={6} alignItems='center' justifyContent='center' mt={3} mb={3}>
                    <Typography variant="h4" sx={{ m: 2 }}>Log Workout </Typography>
                </Grid>



                <form noValidate  >

                    <Grid container spacing={1} alignItems='center' justifyContent='center'>

                        {showSets ? (
                            <>
                                <Grid item xs={3} sm={3} >

                                    <TextField  {...register("date")} InputLabelProps={{ shrink: true, required: true }} type='date' name='date' label="Workout Date" placeholder='' />

                                </Grid>

                                <Grid item xs={6} sm={6}>
                                    <TextField {...register("WorkoutType")} name="WorkoutType" select label="Exercise Type" fullWidth defaultValue="push">
                                        <MenuItem value="push">Push</MenuItem>
                                        <MenuItem value="pull">Pull</MenuItem>
                                        <MenuItem value="legs">Legs</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField {...register(`name`)} name={`name`} placeholder='Exercise' label="Exercise" select fullWidth
                                        onChange={(e) => {
                                            
                                            let w = {}
                                            w[`exercise${exerciseNum}`] = e.target.value;
                                            for (const [key, value] of Object.entries(values)) {
                                                if (value !== null)  w[key] = value;
                                               
                                            }
                                            console.log(w)
                                           
                                            setShowSets(false);
                                        }

                                        }


                                        defaultValue="">
                                        <MenuItem value="">Choose Exercise.....</MenuItem>
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
                                </Grid>  </>) :  NumberFields.map((num, index) => {





                            
                               

                                    return (
                                        <Grid container spacing={1} alignItems='center' justifyContent='center' margin={1}>





                                            <Grid item xs={4} sm={6} md={3}>
                                                <TextField className="form-control" name={`load${num}`} placeholder='Load' type='number' label='Load (lbs)' {...register(`Load${num}`)} />




                                            </Grid>

                                            <Grid item xs={4} sm={6} md={3}>
                                                <TextField {...register(`Reps${num}`)} className="form-control" name={`Reps${num}`} placeholder='Reps' label='Reps' type='number' defaultValue="">




                                                </TextField>

                                            </Grid>

                                            <Grid item xs={4} sm={6} md={2}>

                                                <TextField {...register(`Sets${num}`)} className="form-control" name={`Sets${num}`} label='Set' placeholder='Sets' type='number' defaultValue={num}>


                                                </TextField>
                                            </Grid>
                                        </Grid>

                                    )
                                })
                            }




                            



                    <Grid item> <Button type='button' startIcon={<Add />} variant='contained' onClick={() => {
                        //add one to exercise field
                       
                        // let exercise + exerciseNum = {};

                        

                        // let exercise = {
                        //     "name": currentExerciseValues
                        //         .name,
                        //     "load1": currentExerciseValues
                        //         .load1,
                        //     "load2": currentExerciseValues
                        //         .load2,
                        //     "load3": currentExerciseValues
                        //         .load3,
                        //     "load4": currentExerciseValues
                        //         .load4,
                        //     "reps1": currentExerciseValues
                        //         .reps1,
                        //     "reps2": currentExerciseValues
                        //         .reps2,
                        //     "reps3": currentExerciseValues
                        //         .reps3,
                        //     "reps4": currentExerciseValues
                        //         .reps4,
                        //     "sets1": currentExerciseValues
                        //         .sets1,
                        //     "sets2": currentExerciseValues
                        //         .sets2,
                        //     "sets3": currentExerciseValues
                        //         .sets3,
                        //     "sets4": currentExerciseValues
                        //         .sets4,


                        // }
                        // workoutlog.push(exercise[exerciseNum])

                        // setWorkoutLogs(workoutlog)


                        exerciseNum = + 1;
                        setShowSets(true)

                    }








                    }

                        // setNumberFields(
                        //     previousNumberFields =>
                        //         [...previousNumberFields, previousNumberFields.length + 1]
                        //         )



                        color='primary' >

                        Add Exercise
                    </Button></Grid>






                    <Grid item>  <Button type='submit' startIcon={<Save />} variant='contained' color='primary' >

                        Save Workout
                    </Button></Grid>


                    <DevTool control={control} />

                </Grid>
            </ form>


        </Paper>
        </>



    )

}



export default AddWorkoutForm;