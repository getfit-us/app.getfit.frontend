
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { DevTool } from "@hookform/devtools";
import { Box, Button, Container, TextField , MenuItem} from "@mui/material";

const AddExercise = () => {

  const [exercises, setExercises] = useState();
  // const [values, setValues] = useState();

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

  }, [])





  return (
   <Container>
    <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register("Type")} name="Type" select label="Exercise Type" fullWidth defaultValue='push'>
              <MenuItem value="push">Push</MenuItem>
              <MenuItem value="pull">Pull</MenuItem>
              <MenuItem value="legs">Legs</MenuItem>
            </TextField>
           
            <TextField {...register("Exercise")} name="Exercise" fullWidth select>



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
           
            <TextField {...register("exerciseName", { required: true })} placeholder="Exercise name" name="exerciseName" input/>
         
             <Button variant="contained" type="submit" >Submit </Button>

          </form>
       

     
      <DevTool control={control} />
    
      </Box>
      </Container>
  )
}

export default AddExercise