import {useState} from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';



function TransitionUp(props) {
  return ;
}



export default function NotificationSnackBar({setOpenSnackbar, openSnackbar}) {

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
        message={"I love snacks"}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

        
      />
    </div>
  );
}
