
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { DevTool } from "@hookform/devtools";
import { Box, Button, Container, TextField, MenuItem, Typography, Grid, Checkbox, FormControlLabel } from "@mui/material";
import { ErrorMessage } from '@hookform/error-message';
import DeleteIcon from '@mui/icons-material/Delete';
import SendRoundedIcon from '@mui/icons-material/SendRounded';


const AddExercise = () => {

  const [exercises, setExercises] = useState();
  const [reloadExercise, setReloadExercise] = useState(false);
  const [deleteExercise, setDeleteExercise] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const axiosPrivate = useAxiosPrivate();
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });
  const WatchExerciseType = watch(['Type', 'Exercise']);
  let values = getValues();

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/exercises', data, { signal: controller.signal });
      console.log(response.data);

      setReloadExercise(true);
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

  const onDelete = async (data) => {
    // if (!values.deleteExercise.checked  )  return false; 
    let isMounted = true;

    console.log(data);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/exercises/${data}`, { signal: controller.signal });
      console.log(response.data);

      setReloadExercise(true);
      reset({ deleteExercise: false });

    }
    catch (err) {
      console.log(err);

    }
    return () => {
      isMounted = false;


      controller.abort();
    }

  }







  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const controller = new AbortController();

    const getExercise = async () => {
      try {
        const response = await axiosPrivate.get('/exercises', { signal: controller.signal });
        // console.log(typeof response.data);
        // return alphabetic order
        isMounted && setExercises(response.data.sort((a, b) => (a.name > b.name) ? 1 : -1));
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
      setReloadExercise(false);
      controller.abort();
    }

  }, [reloadExercise])


const styles = (theme) => ({
buttons: {
  [theme.breakpoints.up('md')]: {
    marginTop: 3, 
    margin:1
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: 1
  }
}

})



  return (
    <Container component="main" maxWidth="sm">
      <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex',
          flexGrow: 1,
        }}
      >

        <Grid item xs={3} sm={6} lg={6} mt={2}>
          <Typography component="h1" variant="h5" align="center">
            Modify Exercises
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Grid container spacing={1} >
            <Grid item xs={12} sm={3} lg={3} mt={2}>
              <TextField {...register("Type")} name="Type" select label="Exercise Type" fullWidth defaultValue='push' sx={{ mt: 2, mb: 2 }}  >
                <MenuItem value="push">Push</MenuItem>
                <MenuItem value="pull">Pull</MenuItem>
                <MenuItem value="legs">Legs</MenuItem>
              </TextField>
              <ErrorMessage errors={errors} name="Type" />
            </Grid>
            <Grid item xs={12} sm={6} mt={2}>

              <TextField {...register("Exercise")} name="Exercise" label='Current Exercise Selection' select fullWidth sx={{ mt: 2, mb: 2 }} defaultValue=''>

                <MenuItem value="" >Select a exercise</MenuItem>

                {loading && <MenuItem>Loading...</MenuItem>}
                {error && <MenuItem>Error could not read exercise list</MenuItem>}

                {exercises && exercises.filter(exercise => exercise.type === values.Type).map((exercise) => {





                  return (

                    <MenuItem md='5' className='m-4' key={exercise.id} value={exercise.name}>
                      {exercise.name}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2} mt={2} justifyContent="center">
              <Button onClick={() => {
                const targetExercise = exercises.filter(exercise => exercise.name === values.Exercise);
                setDeleteExercise(targetExercise[0]._id);
                onDelete(deleteExercise);
              }}
                variant="contained" endIcon={<DeleteIcon />}  sx={{ mt: 3, xs: { mt: 1 } }}>Delete

              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField {...register("exerciseName", { required: "Please enter the name of the exercise to add." })} fullWidth placeholder="Exercise name" name="exerciseName" label='New Exercise Name' input sx={{ mt: 2 }}

              />
              <Typography mt={2} mb={2} ><ErrorMessage errors={errors} name="exerciseName" /></Typography>

            </Grid>
            <Grid item xs={12} sm={4} >
              <Button type="submit" color="secondary" variant="contained" sx={{ mt: 3, mb: 2 }} endIcon={<SendRoundedIcon />} >Add Exercise</Button>
            </Grid>






          </Grid>
        </form>





        <DevTool control={control} />

      </Grid>
    </Container>
  )
}

export default AddExercise