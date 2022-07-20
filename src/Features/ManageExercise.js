
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { DevTool } from "@hookform/devtools";
import { Box, Button, Container, TextField , MenuItem, Typography} from "@mui/material";
import { ErrorMessage } from '@hookform/error-message';


const AddExercise = () => {

  const [exercises, setExercises] = useState();
  const [reloadExercise, setReloadExercise] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const axiosPrivate = useAxiosPrivate();
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm( {mode: 'onSubmit',
  reValidateMode: 'onChange'});
  const WatchExerciseType = watch(['Type', 'Exercise' ]);


  const onSubmit = async (data) => {
    let isMounted = true;
     console.log(data);

    const controller = new AbortController();
      
    
      try {
        const response = await axiosPrivate.post('/exercises', data , { signal: controller.signal });
        // console.log(response.data);
        reset();
        setReloadExercise(true);
        
      }
      catch (err) {
        console.log(err);
      

        //save last page so they return back to page before re auth. 
        // navigate('/login', {state: {from: location}, replace: true});
      }
      return () => {
        isMounted = false;
        
  
        controller.abort();
      }

    }

    
   
    let values = getValues();

  


  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const controller = new AbortController();

    const getExercise = async () => {
      try {
        const response = await axiosPrivate.get('/exercises', { signal: controller.signal });
        // console.log(response.data);
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

  }, [reloadExercise])





  return (
   <Container>
    <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>

    <Typography component="h1" variant="h5">
            New Exercise
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField {...register("Type", {required: "Select Exercise Type"})} name="Type" select label="Exercise Type" fullWidth defaultValue='push' sx={{ mt: 2, mb: 2 }}  >
              <MenuItem value="push">Push</MenuItem>
              <MenuItem value="pull">Pull</MenuItem>
              <MenuItem value="legs">Legs</MenuItem>
            </TextField>
            <ErrorMessage errors={errors} name="Type" />
            <TextField {...register("Exercise")} name="Exercise" fullWidth label='Current Exercise Selection' select sx={{ mt: 2, mb: 2 }}>



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
           
            <TextField {...register("exerciseName", { required: "Please enter the name of the exercise" })} placeholder="Exercise name" name="exerciseName"  label='New Exercise Name' fullWidth input sx={{ mt: 2, mb: 2 }}
            
            />
            <ErrorMessage errors={errors} name="exerciseName" />
         
             <Button color="secondary" variant="contained" type="submit"  sx={{ mt: 3, mb: 2 }} >Submit </Button>

          </form>
       

     
      <DevTool control={control} />
    
      </Box>
      </Container>
  )
}

export default AddExercise