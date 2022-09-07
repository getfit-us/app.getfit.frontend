import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import useProfile from '../../utils/useProfile';
import { IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const WorkoutModal = ({modalOpen, setModalOpen, setNewWorkoutName}) => {
    const {state, dispatch} = useProfile();
    
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const createWorkout =  () => { 
        const workoutName = document.getElementById('workoutName').value;
       
        if (workoutName) {
            setNewWorkoutName(workoutName);
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Workout
              </Typography>
              <IconButton aria-label="Close"  onClick={handleClose} style={style.close}>
          <CloseIcon />
        </IconButton>
                <div style={style.form}>
             <TextField id="workoutName" type='text' fullWidth label='Workout Name'/>
             </div>
             <Button variant='contained' size='medium' sx={{align: 'center', borderRadius: 20}} onClick={() => createWorkout()}>Create</Button>
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
        width: 400,
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
 


