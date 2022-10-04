import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ContinueWorkout = ({
  modalOpenUnfinishedWorkout,
  setModalOpenUnFinishedWorkout,
  setStartWorkout,
}) => {
  const unfinishedWorkout = JSON.parse(localStorage.getItem("startWorkout"));
  const handleOpen = () => setModalOpenUnFinishedWorkout(true);
  const handleClose = () => setModalOpenUnFinishedWorkout(false);
  const clearStorage = () => {
    //clear unfinishedWorkout and close modal
    localStorage.removeItem("startWorkout");
    handleClose();
  };

  const continueWorkout = () => {
    //set startWorkout to unfinishedWorkout and close modal
    setStartWorkout(unfinishedWorkout);
    handleClose();
  };

  if (unfinishedWorkout)
    return (
      <div className="container">
        <Modal
          open={modalOpenUnfinishedWorkout}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid container sx={style.container}>
            <Grid item xs={12}>
              {" "}
              <Typography id="modal-modal-title" variant="h6" component="h2" className="title">
                Continue workout:{" "}
                {unfinishedWorkout[0].name} ?
              </Typography>
            </Grid>
            <IconButton
              aria-label="Close"
              onClick={handleClose}
              style={style.close}
            >
              <CloseIcon />
            </IconButton>
            <Grid item xs={12} sx={{justifyContent: 'center', display: 'flex'}}>
              <Button
                variant="contained"
                size="medium"
                sx={{ align: "center", borderRadius: 20, mr: 2 }}
                onClick={continueWorkout}
                color="success"
              >
                Yes
              </Button>
            </Grid>{" "}
            <Grid item xs={12} sx={{justifyContent: 'center', display: 'flex'}}>
              <Button
                variant="contained"
                size="medium"
                color='warning'
                sx={{ align: "center", borderRadius: 20 }}
                onClick={clearStorage}
              >
                No (Start a new workout)
              </Button>
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

export default ContinueWorkout;
