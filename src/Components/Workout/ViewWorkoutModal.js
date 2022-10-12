import { Close, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

const ViewWorkoutModal = ({ viewWorkout, open, handleModal }) => {
  //plan to resuse this component for viewing workouts from the overview page
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

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  console.log(viewWorkout);
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
        <Grid
          item
          xs={12}
          sx={{ position: "relative", justifyContent: "center" }}
        >
          <DialogTitle
            id="scroll-dialog-title"
            sx={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {" "}
            {!viewWorkout[0]?.dateCompleted && <h3>New Workout Created</h3>}
            Name: {viewWorkout[0]?.name}{" "}
          </DialogTitle>
          <h3 style={{ textAlign: "center", justifyContent: "center" }}>
            {viewWorkout[0]?.dateCompleted
              ? new Date(viewWorkout[0]?.dateCompleted).toLocaleString()
              : new Date(viewWorkout[0]?.Created).toLocaleString()}
          </h3>
          {viewWorkout[0]?.dateCompleted && (
            <>
              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", justifyContent: "center" }}
              >
                <h4>Rating</h4>
                <Rating
                  name="Rating"
                  value={viewWorkout[0]?.rating}
                  precision={0.5}
                  getLabelText={getLabelText}
                  readOnly
                  emptyIcon={
                    <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", justifyContent: "center" }}
              >
                {labels[viewWorkout[0]?.rating]}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", justifyContent: "center" }}
              >
                {" "}
                <h3>Workout Feedback</h3>
                <p>{viewWorkout[0]?.feedback}</p>
              </Grid>
            </>
          )}

          <IconButton
            onClick={handleModal}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <Close />{" "}
          </IconButton>
        </Grid>

        <DialogContent dividers>
          {viewWorkout[0]?.exercises?.map((exercise, idx) => {
            return Array.isArray(exercise) ? (
              <Grid container className="ViewWorkoutSuperSet">
                <h3>SuperSet</h3>
                {exercise.map((superset, supersetIndex) => {
                  return (
                    <>
                      <Grid item xs={12} align="center" key={idx + 1}>
                        <span style={styles.span}>{superset?.name}</span>
                      </Grid>
                      <Grid item xs={12} align="center" key={idx + 2}>
                        {superset?.numOfSets?.map((sset, i) => (
                          <p key={i}>
                            <span style={styles.span}>Weight: </span>
                            <span style={styles.tableTextLoad}>
                              {" "}
                              {sset.weight}{" "}
                            </span>{" "}
                            <span style={styles.span}>(lbs) Reps:</span>
                            <span style={styles.tableTextReps}>
                              {sset.reps}
                            </span>
                          </p>
                        ))}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        align="center"
                        sx={{ mt: 1, mb: 1 }}
                        key={idx + 3}
                      >
                        {exercise?.notes?.length > 0 && (
                          <>
                            <span>{exercise.name} Notes</span>
                            <p>{exercise?.notes}</p>
                          </>
                        )}
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            ) : (exercise.type==='cardio') ? (<>
              <Grid item xs={12} align="center" key={idx + 1}>
                <span style={styles.span}>{exercise.name}</span>
              </Grid>
              <Grid item xs={12} align="center" key={idx + 1}>
              <span style={styles.span}>Level: {exercise.numOfSets[0].level} </span>
              <span style={styles.span}>Minutes: {exercise.numOfSets[0].minutes} </span>
              <span style={styles.span}>Heart Rate: {exercise.numOfSets[0].heartRate} </span>

              </Grid>
              
              </>
            ):  (
              <>
                <Grid item xs={12} align="center" key={idx + 1}>
                  <span style={styles.span}>{exercise?.name}</span>
                </Grid>
                <Grid item xs={12} align="center" key={idx + 2}>
                  {exercise?.numOfSets?.map((set, i) => (
                    <p key={i}>
                      <span style={styles.span}>Weight: </span>
                      <span style={styles.tableTextLoad}>
                        {" "}
                        {set.weight}{" "}
                      </span>{" "}
                      <span style={styles.span}>(lbs) Reps:</span>
                      <span style={styles.tableTextReps}>{set.reps}</span>
                    </p>
                  ))}
                </Grid>
                <Grid
                  item
                  xs={12}
                  align="center"
                  sx={{ mt: 1, mb: 1 }}
                  key={idx + 3}
                >
                  {exercise?.notes?.length > 0 && (
                    <>
                      <span>{exercise.name} Notes</span>
                      <p>{exercise?.notes}</p>
                    </>
                  )}
                </Grid>
              </>
            );
          })}
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
};

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
  span: {
    fontWeight: "600",
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

export default ViewWorkoutModal;
