import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import useProfile from '../../hooks/useProfile';
import { Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateWorkout from './CreateWorkout';
const WorkoutModal = ({modalOpen, setModalOpen, setNewWorkoutName }) => {
    const {state, dispatch} = useProfile();
    
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const createWorkout =  () => { 
        const workoutName = document.getElementById('workoutName').value;
        
        if (workoutName) {
            setNewWorkoutName(workoutName.replace(/^./, workoutName[0].toUpperCase()));
           
            handleClose();




        } else {
          setNewWorkoutName(false)
            handleClose()
        }

    }

    return (
        <div>
        
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style.container}>
              <h2 className='page-title' style={{padding: 10}}>
                Create Workout
              </h2>
              <IconButton aria-label="Close"  onClick={handleClose} style={style.close}>
          <CloseIcon />
        </IconButton>
                <div style={style.form}>
             <TextField id="workoutName" type='text' fullWidth label='Workout Name'/>
             </div>
             <Grid item xs={12} sx={{display: 'flex',justifyContent: 'center',}} >             <Button variant='contained' size='large' sx={{textAlign: 'center', borderRadius: 20, width: '100px'}} onClick={() => createWorkout()}>Create</Button>
</Grid>
            </Box>
          </Modal>
        </div>
      );
}

export default WorkoutModal





const style = {
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: "90%", sm: "70%", md: "40%" },
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection:'column',
        gap: 2
      },
      form: {
        p:3,
        

      },
      close: {
        position: 'fixed',
        top: 0,
        right: 0,
      }
    }
 


