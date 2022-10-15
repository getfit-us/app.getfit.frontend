import { Close, Star } from "@mui/icons-material";
import {
  
  Button,
 
  CircularProgress,
 
  Grid,
  IconButton,
  MenuItem,
  Rating,
  TextField,
 
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

const CalendarModal = ({handleModal, open}) => {
  
   return (
        <Dialog
          open={open}
          onClose={handleModal}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <Grid
            container
            spacing={0}
            sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}
          >
           <Grid item xs={12}> <DialogTitle
                id="scroll-dialog-title"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                Add New Event
              </DialogTitle></Grid>
             
            
    
            <DialogContent dividers>
                <Grid item xs={12}>
                <TextField select fullWidth label="Event Type" defaultValue='default'>
                    <MenuItem value='default'>Select a type of event</MenuItem>
                    <MenuItem value='goal'>Goal</MenuItem>
                    <MenuItem value='task'>Task</MenuItem>
                    <MenuItem value='reminder'>Reminder</MenuItem>

                </TextField>
                </Grid>
                <Grid item xs={12}>
                    
                </Grid>
             
            </DialogContent>
            <Grid item xs={12} align="center">
              <Button
                onClick={handleModal}
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, bgcolor: "#689ee1" }}
                endIcon={<Close />}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      );
    }
    
    const styles = {
      modal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "100%",
        maxHeight: "90%",
        // minWidth: "250px",
        width: { xs: "90%", sm: "70%", md: "40%" },
        bgcolor: "background.paper",
        border: "2px solid #474a48",
        boxShadow: 24,
        p: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      },
      spantitle: {
        fontWeight: "600",
        textDecoration: 'underline',
      },
      tableTextLoad: {
        color: "red",
      },
      tableTextReps: {
        color: "blue",
      },
      tableColumns: {
        textDecoration: "underline",
      },
    
    };
    
 
    


export default CalendarModal