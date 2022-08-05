import useAxiosPrivate from '../utils/useAxiosPrivate';
import { useState, useEffect } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const UploadImg = ( { clientId } ) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();


    const onSubmit = async (e, data) => {
        e.preventDefault();
        

        const myFiles = document.getElementById('avatar').files
        const formData = new FormData()

        Object.keys(myFiles).forEach(key => {
            formData.append(myFiles.item(key).name, myFiles.item(key))
        })
        let isMounted = true;
       
        formData.id = clientId;
        console.log(formData)

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.post('/upload', formData, 
                { signal: controller.signal });
            console.log(response.data);
            const form = document.getElementById('avatar');
            form.value = ""
            // navigate('/profile', { replace: true }); 

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
       <form id="upload" onSubmit={onSubmit} enctype="multipart/form-data">
      
       <Grid container> 
      
       <Grid item margin={2}>
        <TextField label='Profile image' inputProps={{shrink: true}} type='file' fullWidth name='avatar'  id='avatar' accept='image/*' multiple>

        </TextField>
       </Grid>
       <Grid item xs={12}>
        <Button type='submit' variant='contained'>Upload</Button>
       </Grid>
       
       </Grid>
       </form>
    )
}

export default UploadImg