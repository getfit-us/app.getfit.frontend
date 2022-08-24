import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { DevTool } from "@hookform/devtools";
import {
  Button, TextField, MenuItem, Typography, Grid,
  Paper, Fab, CircularProgress, Fade, Box, Modal,
  Backdrop,
  Tooltip

} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import SaveIcon from '@mui/icons-material/Save';
import { Add, Close, SendRounded } from '@mui/icons-material';
import { ErrorMessage } from "@hookform/error-message";
import { update } from "../server/model/Exercise";
import ExerciseActions from "../Components/ExerciseActions";




const ManageExercise = () => {
  const [rowId, setRowId] = useState(null);
  const [exercises, setExercises] = useState();
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen(prev => !prev);
  // const handleClose = () => setOpen(prev => !prev);
  const [error, setError] = useState();
  const axiosPrivate = useAxiosPrivate();
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });
  const WatchExerciseType = watch('type');
  let values = getValues();


  

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post('/exercises', data, { signal: controller.signal });

      setExercises([...exercises, response.data]);

      reset();
      setOpen(prev => !prev);
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
    let isMounted = true;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/exercises/${data}`, { signal: controller.signal });
      setExercises(exercises.filter((exercise) => exercise._id !== data));

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
      controller.abort();
    }

  }, [])




  const columns = useMemo(() => [
    { field: "_id", hide: true },
    {
      field: "dalete", headerName: "Delete", width: 70, height: 90, sortable: false, renderCell: (params) => {

        return (

          <>
            <Tooltip title="Delete">
              <Fab aria-label="add" color='error' size="small">
                <DeleteIcon onClick={() => onDelete(params.row._id)} />
                {loading && <CircularProgress />}
              </Fab>
            </Tooltip>
          </>
        )



      }
    },
    { field: "type", headerName: "Type", width: 120, editable: true },
    { field: "name", headerName: "Exercise Name", width: 300, editable: true },
    
    {
      field: "modify", headerName: "Modify", width: 70, renderCell: (params) => {
        return (
          <ExerciseActions rowId={rowId} params={params} setRowId={setRowId} setExercises={setExercises} exercises={exercises} />
        )
      }
    }



  ], [exercises, rowId]);



  return (

    <Paper elevation={2} >
 <Grid item sx={{marginTop: 15}}>

</Grid>
      <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={3}
        alignItems='center' justifyContent='center'
      >
        <Grid item>
          <Typography variant='h3'>Manage Exercises</Typography>
        </Grid>

        <Grid item xs={12}>
          {error && <p>{error}</p>}
          {loading && <CircularProgress />}

          {exercises && <DataGrid
            rows={exercises}
            columns={columns}
            checkboxSelection={false}
            rowsPerPageOptions={[5, 10, 20, 50]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onCellEditCommit={(params) => setRowId(params.id)}
            getRowId={(row) => row._id}
            getRowSpacing={params => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            autoHeight
            sx={{ mt: 2, mb: 2 }}
          />

          }
          <Grid item sx={{ margin: 2 }}><Fab onClick={() => setOpen(true)}>
            <Add />
          </Fab></Grid>

        </Grid>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style.modal}>




              <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography id="transition-modal-title" variant="h4" component="h2" xs={12}>
                    New Exercise              </Typography>

                  <Grid item xs={12} sm={12} lg={12} mt={5}>
                    <TextField {...register("type")} name="type" select label="Exercise Type" fullWidth defaultValue='push' sx={{ mt: 2, mb: 2 }}  >
                      <MenuItem value="push">Push</MenuItem>
                      <MenuItem value="pull">Pull</MenuItem>
                      <MenuItem value="legs">Legs</MenuItem>
                    </TextField>
                  </Grid>



                  <Grid item xs={12} >
                    <TextField {...register("exerciseName", { required: "Please enter the name of the exercise" })} fullWidth placeholder="Exercise name" name="exerciseName" label='New Exercise Name' input sx={{ mt: 2 }}

                    />
                    <Typography mt={2} mb={2} ><ErrorMessage errors={errors} name="exerciseName" /></Typography>

                  </Grid>
                  <Grid item xs={12}   >
                    <Button type="submit" color="secondary" variant="contained" size='large' sx={{ mt: 3 }} endIcon={<SendRounded />} fullWidth>Add Exercise</Button>
                  </Grid>
                  <Grid item xs={12}   >
                    <Button onClick={handleModal} color="warning" variant="contained" size='large' sx={{ mt: 3, mb: 2 }} endIcon={<Close />} fullWidth>Close</Button>
                  </Grid>






                </Grid>
              </form>
            </Box>
          </Fade>
        </Modal>




      </Grid>
    </Paper>

  )
}

const style = {

  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  }
};

export default ManageExercise;