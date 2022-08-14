import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import useProfile from "../utils/useProfile";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useForm } from "react-hook-form";

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
    const { handleSubmit, reset, control, getValues, errors, register } = useForm({
        mode: 'onBlur', reValidateMode: 'onBlur'
    });
    const [files, setFiles] = useState();


    const onSubmit = async (data) => {
        let isMounted = true;



        //add logged in user id to data
       
      
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/measurements', data, { signal: controller.signal });
            // console.log(response.data);
            dispatch({ type: 'ADD_MEASUREMENT', payload: response.data })

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
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount

        if (files) {
            return () => files.forEach(file => URL.revokeObjectURL(file.preview));
        }
       
    }, []);






    return (
        <Grid container sx={{ mt: 3 }}>
            <form encType="multipart/form-data">
                <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>

                    <Grid item xs={12}>
                        <Typography variant='h2'>Record Measurement</Typography>
                        <Divider />
                    </Grid>


                    <Grid item>
                        <TextField
                            name='weight'
                            label='Body Weight (lbs)'
                            type='number'
                            required
                            {...register('weight')}
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

                    <Grid item xs={12} sx={{ mt: 3, border: 2, p: 3, borderColor: 'grey' }} {...getRootProps({ className: 'dropzone' })} id="dropzone">

                        <TextField {...getInputProps()} name='files' id='files' />
                        <p>Drag 'n' drop Pictures here</p>
                        <p>4 Photos Maximum</p>

                        <aside style={styles.thumbsContainer}>
                            {files && files.map(file => (
                                <div style={styles.thumb} key={file.name}>
                                    <div style={styles.thumbInner}>
                                        <img
                                            src={file.preview}
                                            style={styles.img}
                                            alt="File Preview"
                                            // Revoke data uri after image is loaded
                                            onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </aside>



                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Button variant="outlined" type='submit' onClick={handleSubmit(onSubmit)} startIcon={<Add />}>Add </Button>
                    </Grid>


                </Grid>

            </form>




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


}
export default Measurements