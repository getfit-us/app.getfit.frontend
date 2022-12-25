import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

//user confirm modal

const Confirm = ({ open, setOpen, funcToRun, children }) => {
  return (
    <Dialog maxWidth="xs" minWidth='xs' open={open}>
        <DialogTitle>Confirm </DialogTitle>
      <DialogContent>
        <h2>{children}</h2>
       
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            funcToRun();
            setOpen(false);
          }}
          variant="contained"
          color='warning'
        >
          Yes
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
