import { Close, Save, Star, StarTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import React, {  useState } from "react";
import { useProfile } from "../../../Store/Store";

const SaveWorkoutModal = ({
  modalFinishWorkout,
  handleCloseModal,
  status,
  clientId,
  onSubmit,
  setStartWorkout,
  startWorkout,
}) => {
  const [ratingValue, setRatingValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const profile = useProfile((state) => state.profile);
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };

  return (
    <Modal
      //finish and save Workout modal
      open={modalFinishWorkout}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container sx={styles.modalFinishWorkout}>
        <Grid item xs={12}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ p: 1, textAlign: "center" }}
          >
            Save and complete current workout?
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleCloseModal}
            style={styles.close}
          >
            <Close />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          {" "}
          <TextField
            type="input"
            multiline
            fullWidth
            minRows={3}
            name="workoutFeedback"
            id="workoutFeedback"
            label="Workout Feedback"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {status.loading ? (
            <CircularProgress size={75} color="success" />
          ) : (
            <Rating
              name="hover-feedback"
              value={ratingValue}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, ratingValue) => {
                setRatingValue(ratingValue);
                // workoutLog.rating = ratingValue;
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {ratingValue !== null && (
            <Box sx={{ ml: 2 }}>
              {labels[hover !== -1 ? hover : ratingValue]}
            </Box>
          )}
        </Grid>

        <Button
          variant="contained"
          size="medium"
          endIcon={<Save />}
          color={status.error ? "error" : "success"}
          sx={{
            align: "center",
            borderRadius: 20,
            mt: 1,
            mr: 1,
            ml: 1,
          }}
          onClick={() => {
            // use localStorage, grab data from localStorage
            //check localStorage for current workout..
            if (!localStorage.getItem("startWorkout")) {
              //if no current workout, then setStartWorkout  save state to local storage
              localStorage.setItem(
                "startWorkout",
                JSON.stringify(startWorkout)
              );
            }

            const updated = JSON.parse(localStorage.getItem("startWorkout"));

            const feedback = document.getElementById("workoutFeedback").value;
            const workoutName = document.getElementById("WorkoutName").value;
            if (feedback) updated[0].feedback = feedback;
            else updated[0].feedback = "";
            if (workoutName) updated[0].name = workoutName;

            updated[0].rating = ratingValue;
            //add current user ID , check if being managed by trainer
            if (clientId?.length > 0) updated[0].id = clientId;
            else updated[0].id = profile.clientId;

            setStartWorkout(updated);
            localStorage.setItem("startWorkout", JSON.stringify(updated));

            onSubmit(updated[0]);
          }}
        >
          {status.error ? "Error Try Again" : "Save"}
        </Button>

        <Button
          variant="contained"
          size="medium"
          color="warning"
          sx={{ align: "center", borderRadius: 20, mt: 1 }}
          onClick={() => {
            handleCloseModal();
          }}
        >
          Cancel
        </Button>
      </Grid>
    </Modal>
  );
};

const styles = {
  modalFinishWorkout: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // minWidth: "50%",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    // boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",

    gap: 2,
  },

  close: {
    position: "fixed",
    top: 10,
    right: 0,
  },
};

export default SaveWorkoutModal;
