import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ExerciseDetail = ({setEverciseDetails,
    exerciseDetailsOpen, exercise
 
}) => {
  const unfinishedWorkout = JSON.parse(localStorage.getItem("startWorkout"));
  const handleOpen = () => setEverciseDetails(true);
  const handleClose = () => setEverciseDetails(false);
 


  if (unfinishedWorkout)
    return (
      <div className="container">
        <Modal
          open={exerciseDetailsOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid container >
            <Grid item xs={12}>
            <h2>exercise?.name</h2>
            </Grid>
            <IconButton
              aria-label="Close"
              onClick={handleClose}
              style={style.close}
            >
              <CloseIcon />
            </IconButton>
            <Grid item xs={12} sx={{justifyContent: 'center', display: 'flex'}}>
            
            </Grid>
          </Grid>
        </Modal>
      </div>
    );
};

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    gap: 2,
  },
  form: {
    p: 3,
  },
  close: {
    position: "fixed",
    top: 0,
    right: 0,
  },
};

export default ExerciseDetail;
