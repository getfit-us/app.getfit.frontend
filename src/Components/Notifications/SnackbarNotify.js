import {useState} from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Alert } from '@mui/material';



function TransitionUp(props) {
  return ;
}



export default function NotificationSnackBar({setOpenSnackbar, openSnackbar, message}) {

  const handleClick = (Transition) => () => {
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };
  



  return (
    <div>
    
      <Snackbar
        open={openSnackbar}
        onClose={handleClose}
        // TransitionComponent={<Slide  direction="up" />}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

        
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
