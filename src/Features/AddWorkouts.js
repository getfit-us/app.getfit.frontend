import { useForm } from 'react-hook-form'
import { validateAddWorkout } from '../utils/validateAddWorkout';
// import useFetch from '../utils/useFetch';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { Container, Typography, TextField, Grid, MenuItem, Button } from '@mui/material';
import { DevTool } from "@hookform/devtools";



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
        <Container component="main" maxWidth="sm">

            <Typography variant="h4">Add Workout Log</Typography>



            <form noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} >
                <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex',
                        flexGrow: 1,
                    }}
                >
                    <Grid item xs={12} sm={12} lg={3} mt={2}>


                        <TextField {...register("date")} type='date' name='Date' placeholder='Date' />
                        <TextField {...register("WorkoutType")} name="Type" select label="Exercise Type" fullWidth defaultValue='push' sx={{ mt: 2, mb: 2 }}  >
                            <MenuItem value="push">Push</MenuItem>
                            <MenuItem value="pull">Pull</MenuItem>
                            <MenuItem value="legs">Legs</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3} lg={3} mt={2}>
                       
                    </Grid>





                    {/* add map to dynamically add additional Inputs*/}

                    {
                        NumberFields.map((num, index) => {

                            return (
                                <Grid item>
                                    <TextField {...register("Exercise" + { num })} name={'Exercise' + num} placeholder='' select >
                                        <MenuItem value="null">Choose Exercise.....</MenuItem>
                                        {loading && <MenuItem>Loading...</MenuItem>}
                                        {error && <MenuItem>Error could not read exercise list</MenuItem>}

                                        {exercises && exercises.filter(exercise => exercise.type === values.WorkoutType).map((exercise) => {





                                            return (
                                                <option md='5' className='m-4' key={exercise.id} value={exercise.name}>
                                                    {exercise.name}
                                                </option>
                                            )
                                        })}



                                    </TextField>






                                    <TextField className="form-control" name={'Weight' + num} placeholder='Weight' type='text'  {...register("Weight" + { num })} />






                                    <TextField {...register("Reps" + { num })} className="form-control" name={'Reps' + num} placeholder='Reps' select>
                                        <option value="null">Number of Rep(s)</option>

                                        {Reps.map((rep) => {
                                            if (rep !== 0) {


                                                return (

                                                    <option md='5' className='m-4' key={rep} value={rep}>
                                                        {rep}
                                                    </option>

                                                )
                                            }

                                        })}

                                    </TextField>



                                    <TextField {...register("Sets" + { num })} className="form-control" name={'Sets' + num} placeholder='Sets' select >
                                        <option value="null">Set Number</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>

                                    </TextField>
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

                </Grid>
            </form>



            <DevTool control={control} />

        </Container >

    )

}


export default AddWorkoutForm;