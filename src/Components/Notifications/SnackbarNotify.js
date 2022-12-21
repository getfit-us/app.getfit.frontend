import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';



function TransitionUp(props) {
  return ;
}



export default function NotificationSnackBar({setOpenSnackbar, openSnackbar, message, type}) {

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
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
