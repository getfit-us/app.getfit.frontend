import { useForm } from 'react-hook-form'
import { useMemo, useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useProfile from '../utils/useProfile';
import { Typography, TextField, Grid, MenuItem, Button, Paper, Checkbox, FormGroup, FormControlLabel, Rating, Box, Tooltip, Fab, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, CheckCircle, Delete, Edit, Save, Star } from "@mui/icons-material";

import { DevTool } from "@hookform/devtools";
import { getValue } from '@testing-library/user-event/dist/utils';
import { DataGrid } from '@mui/x-data-grid';




const AddWorkoutForm = () => {
    const [exercises, setExercises] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [ratingValue, setRatingValue] = useState(4);
    const [hover, setHover] = useState(-1);
    const [showCardioLength, setShowCardioLength] = useState(false);
    const [showSets, setShowSets] = useState(true);
    const [rows, setRows] = useState([]);

    const [workoutLog, setWorkoutLog] = useState({});
    const [exerciseName, setExerciseName] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    const { register, formState: { errors }, handleSubmit, getValues, setValue, watch, control } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const formValues = getValues();
    const watchv = watch();


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


    const onSubmit = async () => {
        let isMounted = true;
        //add logged in user id to data
        workoutLog.id = state.profile.clientId;
        workoutLog.rating = ratingValue;
        workoutLog.exercises = {}

        //loop through object grab nested objects and log to array to use in table.
        for (const property in workoutLog) {
            // console.log(`${property}: ${workoutLog[property]}`);
            //check if property is object
            if (
                typeof workoutLog[property] === 'object' &&
                !Array.isArray(workoutLog[property]) &&
                workoutLog[property] !== null
            ) {
                // setWorkoutLog({
                //     ...workoutLog, workoutLog[exercises]: 
                //         [property]: workoutLog[property]

                // });

            }
        }
        console.log(workoutLog)

        // const controller = new AbortController();
        // try {
        //     const response = await axiosPrivate.post('/workouts', data, { signal: controller.signal });
        //     // console.log(response.data);
        //     dispatch({ type: 'ADD_WORKOUT', payload: response.data })

        // }
        // catch (err) {
        //     console.log(err);

        // }
        // return () => {
        //     isMounted = false;


        //     controller.abort();
        // }

    }







    //form need to be split into multiple forms 






    return (
        <>

            <Paper elevation={2} sx={{ borderRadius: 4, mb: 4 }}>
                <Grid item xs={12} sm={6} md={6} alignItems='center' justifyContent='center' mt={3} mb={3}>
                    <Typography variant="h4" sx={{ m: 2 }}>Log Workout </Typography>
                </Grid>



                <form noValidate onSubmit={handleSubmit(onSubmit)}>

                    <Grid container spacing={1} alignItems='center' justifyContent='center'  >

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
                                            let date = getValues("date");
                                            let type = getValues("WorkoutType");
                                            let cardio = getValues("cardio");
                                            let length = getValues("length");

                                            setWorkoutLog({
                                                ...workoutLog, [e.target.value]: {},

                                                date: date,
                                                type: type,
                                                cardio: cardio,
                                                length: length,
                                            })
                                            // console.log(workoutLog)
                                            setExerciseName(e.target.value);
                                            setShowSets(false);
                                        }

                                        }


                                        defaultValue="">
                                        <MenuItem value="">Choose Exercise.....</MenuItem>
                                        {loading && <MenuItem>Loading...</MenuItem>}
                                        {error && <MenuItem>Error could not read exercise list</MenuItem>}

                                        {exercises && exercises.filter(exercise => exercise.type === formValues.WorkoutType).map((exercise) => {





                                            return (
                                                <MenuItem md='5' className='m-4' key={exercise._id} value={exercise.name}>
                                                    {exercise.name}
                                                </MenuItem>
                                            )
                                        })}



                                    </TextField>
                                </Grid>
                                <Grid item xs={6} sm={6} >

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





                            </>) : NumberFields.map((num, index) => {








                                return (
                                    <Grid container spacing={1} alignItems='center' justifyContent='center' margin={1}>





                                        <Grid item xs={4} sm={6} md={3}>
                                            <TextField className="form-control" name={`load${num}`} placeholder='Load' type='number' label='Load (lbs)' {...register(`load${num}`)} />




                                        </Grid>

                                        <Grid item xs={4} sm={6} md={3}>
                                            <TextField {...register(`rep${num}`)} className="form-control" name={`rep${num}`} placeholder='Reps' label='Reps' type='number' defaultValue="">




                                            </TextField>

                                        </Grid>

                                        <Grid item xs={4} sm={6} md={2}>

                                            <TextField {...register(`set${num}`)} className="form-control" name={`set${num}`} label='Set' placeholder='Set' type='number' defaultValue={num}>


                                            </TextField>
                                        </Grid>
                                        {(num === (NumberFields.length)) ? <Grid item xs={12}> <Fab onClick={() => setNumberFields(
                                            previousNumberFields =>
                                                [...previousNumberFields, previousNumberFields.length + 1]
                                        )}>
                                            <Add />
                                        </Fab></Grid> : <></>}



                                    </Grid>

                                )
                            })
                        }














                        {showSets ? <Grid item >  <Button type='submit' startIcon={<Save />} variant='contained' color='primary' >

                            Save Workout
                        </Button></Grid> : <Grid item> <Button type='button' startIcon={<Add />} variant='contained' onClick={() => {

                            let set1 = getValues('load1')
                            let rep1 = getValues('rep1')
                            let set2 = getValues('load2')
                            let rep2 = getValues('rep2')
                            let set3 = getValues('load3')
                            let rep3 = getValues('rep3')
                            let set4 = getValues('load4')
                            let rep4 = getValues('rep4')

                            workoutLog[`${exerciseName}`]['Set1'] = {
                                'load': set1,
                                'reps': rep1


                            }
                            workoutLog[`${exerciseName}`]['Set2'] = {
                                'load': set2,
                                'reps': rep2


                            }
                            workoutLog[`${exerciseName}`]['Set3'] = {
                                'load': set3,
                                'reps': rep3


                            }
                            workoutLog[`${exerciseName}`]['Set4'] = {
                                'load': set4,
                                'reps': rep4


                            }


                            setWorkoutLog(workoutLog)
                            setShowSets(true)

                            //loop through object grab nested objects and log to array to use in table.
                            for (const property in workoutLog) {
                                // console.log(`${property}: ${workoutLog[property]}`);
                                //check if property is object
                                if (
                                    typeof workoutLog[property] === 'object' &&
                                    !Array.isArray(workoutLog[property]) &&
                                    workoutLog[property] !== null
                                ) {
                                    // add to rows 



                                    setRows([...rows, {
                                        name: property, set1: workoutLog[property].Set1,
                                        set2: workoutLog[property].Set2,
                                        set3: workoutLog[property].Set3,
                                        set4: workoutLog[property].Set4
                                    }])
                                    console.log(rows)

                                }
                            }
                            //reset form fields for next exercise
                            NumberFields.map((num) => {

                                setValue(`load${num}`, "");
                                setValue(`rep${num}`, "");

                            })
                            console.log(rows)

                        }


                        }
                            color='primary' >

                            Add Exercise
                        </Button></Grid>}




                        <DevTool control={control} />

                    </Grid>
                </ form>


            </Paper>

            {rows[0] &&



                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Exercise</TableCell>
                                <TableCell align="right">Set1</TableCell>
                                <TableCell align="right">Set2</TableCell>
                                <TableCell align="right">Set3</TableCell>
                                <TableCell align="right">Set4</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) =>

                            (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {<Fab sx={{ align: 'start', mr: 2 }}
                                            onClick={() => {

                                                let newRows = rows.filter(item => item.name === row.name)
                                                setRows(newRows)
                                            }
                                            

                                            }

                                        ><Delete /></Fab>}   {row.name}
                                    </TableCell>
                                    <TableCell align="right">Weight: {row.set1.load} (lbs) Reps: {row.set1.reps} </TableCell>
                                    <TableCell align="right">Weight: {row.set2.load} (lbs) Reps: {row.set2.reps}</TableCell>
                                    <TableCell align="right">Weight: {row.set3.load} (lbs) Reps: {row.set3.reps}</TableCell>
                                    <TableCell align="right">Weight: {row.set4.load} (lbs) Reps: {row.set4.reps}</TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>




            }

        </>



    )



}



export default AddWorkoutForm;