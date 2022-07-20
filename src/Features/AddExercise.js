
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { DevTool } from "@hookform/devtools";
import { Box, Button, Container, TextField } from "@mui/material";

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
          <TextField {...register("Type")} name="Type" type="select" label="Exercise Type" as='select'>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
            </TextField>
           
            <TextField {...register("Exercise")} name="Exercise" type="select">



              {loading && <option>Loading...</option>}
              {error && <option>Error could not read exercise list</option>}

              {exercises && exercises.filter(exercise => exercise.type === values.Type).map((exercise) => {





                return (
                  <option md='5' className='m-4' key={exercise.id} value={exercise.name}>
                    {exercise.name}
                  </option>
                )
              })}
            </TextField>
           
            <TextField {...register("exerciseName", { required: true })} placeholder="Exercise name" name="exerciseName"/>
         
             <Button type="submit" value="Submit"/>

          </form>
       

     
      <DevTool control={control} />
    
      </Box>
      </Container>
  )
}

export default AddExercise