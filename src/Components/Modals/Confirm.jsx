import {useState}  from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { spacing } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex', justifyContent: "center",
  flexDirection: 'column',
  spacing: 1,
  gap: 1,

};

export default function Confirm({title, handleConfirm, open, setOpen}) {
 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div>      
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
            <Button variant='contained' color='success' onClick={handleConfirm}>Confirm</Button>
        <Button variant='contained' color="error" onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}
