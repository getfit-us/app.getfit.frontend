import { Close, Star } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Rating,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ViewWorkoutModal = ({ viewWorkout, open, handleModal, status }) => {
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
  console.count('render')
  if (status?.loading) return <CircularProgress />;
  else
    return (
      <Dialog
        open={open}
        onClose={handleModal}
        scroll="body"
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
                ? new Date(viewWorkout[0]?.dateCompleted).toDateString()
                : new Date(viewWorkout[0]?.Created).toDateString()}
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
                <Grid
                  container
                  className="ViewWorkoutSuperSet"
                  key={"superset" + idx}
                >
                  <h3 style={{}}>SuperSet</h3>
                  {exercise.map((superset, supersetIndex) => {
                    return (
                      <>
                        <Grid item xs={12} align="center" key={superset.name}>
                          <span className="viewworkout-title">
                            {superset?.name}
                          </span>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          align="center"
                          key={superset.name + supersetIndex}
                        >
                          {superset?.numOfSets?.map((sset, i) => (
                            <p key={sset.weight + sset.reps + i}>
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
                          key={superset.name + supersetIndex + "note"}
                        >
                          {exercise?.notes?.length > 0 && (
                            <>
                              <span className="viewworkout-notes">Notes</span>
                              <p style={styles.subheader}>{exercise?.notes}</p>
                            </>
                          )}
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              ) : exercise.type === "cardio" ? (
                <>
                  <Grid item xs={12} align="center" key={exercise._id}>
                    <span className="viewworkout-title">{exercise.name}</span>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    align="center"
                    key={exercise._id + "details"}
                  >
                    <span style={styles.span}>
                      Level: {exercise.numOfSets[0].level}{" "}
                    </span>
                    <span style={styles.span}>
                      Minutes: {exercise.numOfSets[0].minutes}{" "}
                    </span>
                    <span style={styles.span}>
                      Heart Rate: {exercise.numOfSets[0].heartRate}{" "}
                    </span>
                  </Grid>
                </>
              ) : (
                <div className="viewWorkout-Exercise">
                  <Grid item xs={12} align="center" key={exercise?.name}>
                    <span className="viewworkout-title">{exercise?.name}</span>
                  </Grid>
                  <Grid item xs={12} align="center" key={exercise?.name + idx}>
                    {exercise?.numOfSets?.map((set, i) => (
                      <p key={exercise._id + idx + i}>
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
                    key={exercise._id + "notes"}
                  >
                    {exercise?.notes?.length > 0 && (
                      <>
                        <span className="viewworkout-title"> Notes</span>
                        <p>{exercise?.notes}</p>
                      </>
                    )}
                  </Grid>
                </div>
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
  spantitle: {
    fontWeight: "600",
    textDecoration: "underline",
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
