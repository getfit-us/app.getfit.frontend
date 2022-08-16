import { Add } from "@mui/icons-material";
import { Button, Card, CardHeader, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import useProfile from "../utils/useProfile";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useForm } from "react-hook-form";
import MeasurementChart from "./MeasurementChart";

const Measurements = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],

        },
        maxFiles: 4,
        onDrop: acceptedFiles => {


            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));

        }

    });
    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    const { handleSubmit, reset, control, getValues, formState: { errors }, register, setError } = useForm({
        mode: 'onBlur', reValidateMode: 'onBlur'
    });
    const [files, setFiles] = useState();
  


    const onSubmit = async (data) => {
        let isMounted = true

        const formData = new FormData()
        if (acceptedFiles) {
            acceptedFiles.map((file) => formData.append(file.name, file))
        }
               //add client id to req so the image can be tagged to client.
        formData.append("id", state.profile.clientId);
        formData.append("weight", data.weight);
        formData.append("bodyfat", data.bodyfat);
        formData.append("date", data.date);


        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/measurements', formData, { signal: controller.signal });
            console.log(response.data);
            dispatch({ type: 'ADD_MEASUREMENT', payload: response.data })
            reset(); //reset form values 
            setFiles([]); //reset files 
        }
        catch (err) {
            console.log(err);

        }
        return () => {
            isMounted = false;


            controller.abort();
        }

    }

    const getMeasurements = async (id) => {
        const controller = new AbortController();
        try {
          const response = await axiosPrivate.get(`/measurements/client/${id}`, { signal: controller.signal });
          console.log(`res from backend: ${response.data}`);
          dispatch({ type: 'SET_MEASUREMENTS', payload: response.data })
            
               
    
        }
        catch (err) {
          console.log(err);
          setError(err);
          //save last page so they return back to page before re auth. 
          // navigate('/login', {state: {from: location}, replace: true});
        }
        return () => {
          controller.abort();
    
        }
      }


    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount

        if (files) {
            return () => files.forEach(file => URL.revokeObjectURL(file.preview));
        }

        if (!state.measurements[0]) {
            console.log('inside useeffect measurements')
            getMeasurements(state.profile.clientId);
        }


    }, []);

    console.log(state.measurements)



    return (
        <Grid container sx={{ mt: 3 , alignItems: 'center', justifyContent: 'center'}}>
            <form encType="multipart/form-data">
                <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>

                    <Grid item xs={12} sx={{m:2}}>
                        <Typography variant='h4' style={styles.p}>Record Measurement</Typography>
                        <Divider />
                    </Grid>

                <Grid item>
                    <TextField
                        name='date'
                        label='Date'
                        InputLabelProps={{ shrink: true, required: true }} type='date'
                        {...register('date')}
                        />
                </Grid>
                    <Grid item>
                        <TextField
                            name='weight'
                            label='Body Weight (lbs)'
                            type='number'
                           
                            {...register('weight', {
                                required: true,
                                min: 75, max: 600,
                                valueAsNumber: true,
                            })}

                        />


                    </Grid>
                    <Grid item>
                        <TextField
                            name='bodyfat'
                            label='Body Fat'
                            type='number'
                            {...register('bodyfat')}
                        />

                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3,p: 3, border: 2 , justifyItems: 'center' }} {...getRootProps({ className: 'dropzone' })} id="dropzone">

                        <TextField {...getInputProps()} name='files' id='files' />
                        <p style={styles.p} >Drag 'n' drop Pictures here</p>
                        <p style={styles.p}>4 Photos Maximum</p>

                        <Grid style={styles.thumbsContainer}>
                            {files && files.map(file => (
                                <Grid style={styles.thumb} key={file.name}>
                                    <Grid style={styles.thumbInner}>
                                        <img
                                            src={file.preview}
                                            style={styles.img}
                                            alt="File Preview"
                                            // Revoke data uri after image is loaded
                                            onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>



                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3, mb: 3, align: 'center' }}>
                        <Button variant="contained" type='submit' onClick={handleSubmit(onSubmit)} startIcon={<Add />}>Add </Button>
                    </Grid>


                </Grid>

            </form>
            <Card elevation={3} sx={{bgcolor: '#E4E7E7'}}>
                <CardHeader></CardHeader>

            {state.measurements[0] && <MeasurementChart width={700} style={styles.chart}/>}    
            </Card>
            
            
                               
        </Grid>

                     

    )
}


const styles = {

    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    },

    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    },

    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    },

    img: {
        display: 'block',
        width: 'auto',
        height: '100%'
    },

    p: {
        textAlign: 'center'

    },
    chart: {
        margin: 2
    }
}
export default Measurements