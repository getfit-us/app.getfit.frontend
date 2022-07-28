import { useForm } from 'react-hook-form'
import { validateAddWorkout } from '../utils/validateAddWorkout';
// import useFetch from '../utils/useFetch';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import {  Typography, TextField, Grid, MenuItem, Button, Paper } from '@mui/material';
import { DevTool } from "@hookform/devtools";

const drawerWidth = 200;

const AddWorkoutForm = () => {
    // const { loading, error, data: exercises } = useFetch('http://localhost:8000/exercises');
    const [exercises, setExercises] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const axiosPrivate = useAxiosPrivate();
    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const WatchExerciseType = watch('WorkoutType');
    let values = getValues();
    let Reps = Array.from(Array(41).keys());
    const [NumberFields, setNumberFields] = useState([1, 2, 3, 4, 5]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();

        const getExercise = async () => {
            try {
                const response = await axiosPrivate.get('/exercises', { signal: controller.signal });
                console.log(response.data);
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

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/exercises', data, { signal: controller.signal });
            console.log(response.data);

            //   setReloadExercise(true);
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





    return (
       <>

        <Paper elevation={2}>
            <Grid item xs={12} sm={6} md={6} alignItems='center' justifyContent='center' mt={3} mb={3}>
                <Typography variant="h4" >Add Workout </Typography>
            </Grid>



            <form noValidate onSubmit={handleSubmit(onSubmit)} >
         
            <Grid container spacing={1} alignItems='center' justifyContent='center'>
        
                <Grid item xs={6} sm={6} >


                    <TextField {...register("date")} type='date' name='date' label="Workout Date" placeholder='' />

                </Grid>
                <Grid item xs={6} sm={6}>
                    <TextField {...register("WorkoutType")} name="WorkoutType" select label="Exercise Type" fullWidth  >
                        <MenuItem value="push">Push</MenuItem>
                        <MenuItem value="pull">Pull</MenuItem>
                        <MenuItem value="legs">Legs</MenuItem>
                    </TextField>
                </Grid>





                {/* add map to dynamically add additional Inputs*/}

                {
                    NumberFields.map((num, index) => {

                        return (
                            <Grid container spacing={1} alignItems='center' justifyContent='center' margin={1}>
                                
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField {...register(`Exercise${num}`)} name={`Exercise${num}`} placeholder='Exercise'  label="Exercise" select fullWidth default='Choose Exercise.....'>
                                        <MenuItem value="null">Choose Exercise.....</MenuItem>
                                        {loading && <MenuItem>Loading...</MenuItem>}
                                        {error && <MenuItem>Error could not read exercise list</MenuItem>}

                                        {exercises && exercises.filter(exercise => exercise.type === values.WorkoutType).map((exercise) => {





                                            return (
                                                <MenuItem md='5' className='m-4' key={exercise.id} value={exercise.name}>
                                                    {exercise.name}
                                                </MenuItem>
                                            )
                                        })}



                                    </TextField>
                                </Grid>




                                <Grid item  xs={4} sm={6} md={3}>
                                    <TextField className="form-control" name={`Weight${num}`} placeholder='Weight' type='text' label='Weight Used' {...register(`Weight${num}`)} />




                                </Grid>

                                <Grid item xs={4} sm={6} md={3}>
                                    <TextField {...register(`Reps${num}`)} className="form-control" name={`Reps${num}`} placeholder='Reps' label='Reps' select>
                                        <MenuItem value="null">Number of Rep(s)</MenuItem>

                                        {Reps.map((rep) => {
                                            if (rep !== 0) {


                                                return (

                                                    <MenuItem md='5' className='m-4' key={rep} value={rep}>
                                                        {rep}
                                                    </MenuItem>

                                                )
                                            }

                                        })}

                                    </TextField>

                                </Grid>

                                <Grid item xs={4} sm={6} md={2}>

                                    <TextField {...register(`Sets${ num }`)} className="form-control" name={`Sets${ num }`} label='Set' placeholder='Sets' select >
                                        <MenuItem value="null">Set Number</MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>

                                    </TextField>
                                </Grid>
                                </Grid>
                               
                        )
                    })}

                <Button type='button' onClick={() => setNumberFields(
                    previousNumberFields =>
                        [...previousNumberFields, previousNumberFields.length + 1]



                )} color='primary' >

                    Add Exercise
                </Button>







                <Button type='submit' color='primary' >

                    Log Workout
                </Button>
                <DevTool control={control} />
               
                </Grid>
            </ form>
        

            </Paper>
</>



    )

}



export default AddWorkoutForm;