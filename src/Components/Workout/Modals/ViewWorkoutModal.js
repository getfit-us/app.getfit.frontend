import { Close, Star } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Rating } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { colors } from "../../../Store/colors";

const RenderSuperset = ({ exercise, index }) => {
  return (
    <div key={"superset" + index}>
      <h2 key={"superset h3" + index}>SuperSet</h2>
      {exercise.map((superSetExercise, supersetIndex) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: ".5rem",
            }}
            key={superSetExercise._id + "div"}
          >
            <span
              style={styles.exerciseTitle}
              key={superSetExercise._id + "span"}
            >
              {superSetExercise?.name}
            </span>

            {superSetExercise?.numOfSets?.map((sset, i) => {
              return (
                <p key={superSetExercise._id + "sets" + i + "ptag"}>
                  <span
                    style={styles.span}
                    key={superSetExercise._id + "sets" + i + "span weight"}
                  >
                    Weight:{" "}
                  </span>
                  <span
                    style={styles.tableTextLoad}
                    key={
                      superSetExercise._id + "sets" + i + "span weight value"
                    }
                  >
                    {sset.weight}
                  </span>
                  <span
                    style={styles.span}
                    key={superSetExercise._id + "sets" + i + "span reps"}
                  >
                    (lbs) Reps:
                  </span>
                  <span
                    key={superSetExercise._id + "sets" + i + "span reps value"}
                    style={styles.tableTextReps}
                  >
                    {sset.reps}
                  </span>
                </p>
              );
            })}
            {exercise?.notes?.length > 0 && (
              <>
                <span key={superSetExercise._id + "Notes title"}>Notes</span>
                <p
                  style={styles.notes}
                  key={superSetExercise._id + "exercise Notes"}
                >
                  {exercise?.notes}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

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
  if (status?.loading) return <CircularProgress />;
  else
    return (
      <>
        <Dialog
          open={open}
          onClose={handleModal}
          scroll="body"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            <DialogTitle
              id="scroll-dialog-title"
              sx={{
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: 2,
                backgroundColor: colors.primaryLight,
                color: "white",
                width: "100%",
                boxShadow: "0px 2px 2px 0px grey",
              }}
            >
              {viewWorkout[0]?.name}
            </DialogTitle>

            <h3
              style={{
                textAlign: "center",
                justifyContent: "center",
                textDecoration: "underline",
                paddingLeft: ".5rem",
                paddingRight: ".5rem",
              }}
            >
              {viewWorkout[0]?.dateCompleted
                ? "Date Completed: " +
                  new Date(viewWorkout[0]?.dateCompleted).toDateString()
                : "Date Created: " +
                  new Date(viewWorkout[0]?.Created).toDateString()}
            </h3>
            {viewWorkout[0]?.dateCompleted && ( //Completed workout not a newly created one
              <div>
                <h3>Workout Feedback</h3>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: ".5rem",
                    flexDirection: "column",
                  }}
                >
                  {labels[viewWorkout[0]?.rating]}
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
                </span>

                <p style={styles.notes}>
                  {viewWorkout[0]?.feedback
                    ? viewWorkout[0].feedback
                    : "No Workout Notes"}
                </p>
              </div>
            )}

            <IconButton
              onClick={handleModal}
              sx={{ position: "absolute", top: 5, right: 2, color: "white" }}
            >
              <Close />
            </IconButton>

            <DialogContent dividers
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: 0,
              width: "100%",
            }}
            
            >
              {viewWorkout[0]?.exercises?.map((exercise, idx) => {
                return Array.isArray(exercise) ? (
                  <div key={"superset div" + idx}>
                    
                    <RenderSuperset exercise={exercise} index={idx} key={idx} />
                  </div>
                ) : exercise.type === "cardio" ? (
                  <div>
                    <span
                      style={styles.exerciseTitle}
                      key={exercise._id + "exercise span name"}
                    >
                      {exercise.name}
                    </span>

                    <span style={styles.span} key={exercise._id + "level"}>
                      Level: {exercise.numOfSets[0].level}{" "}
                    </span>
                    <span style={styles.span} key={exercise._id + "minutes"}>
                      Minutes: {exercise.numOfSets[0].minutes}{" "}
                    </span>
                    <span style={styles.span} key={exercise._id + "heartRate"}>
                      Heart Rate: {exercise.numOfSets[0].heartRate}{" "}
                    </span>
                  </div>
                ) : (
                  <div
                    className="viewWorkout-Exercise"
                    key={exercise._id + "exercise Div"}
                  >
                    <span style={styles.exerciseTitle}>{exercise?.name}</span>

                    {exercise?.numOfSets?.map((set, i) => (
                      <p key={exercise._id + "set" + i}>
                        <span style={styles.span}>Weight: </span>
                        <span style={styles.tableTextLoad}>
                          {" "}
                          {set.weight}{" "}
                        </span>{" "}
                        <span style={styles.span}>(lbs) Reps:</span>
                        <span style={styles.tableTextReps}>{set.reps}</span>
                      </p>
                    ))}
                    {exercise?.notes?.length > 0 && (
                      <div>
                        <span> Notes</span>
                        <p style={styles.notes}>{exercise?.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </DialogContent>
          </div>
          <Button
            onClick={handleModal}
            variant="contained"
            color="warning"
            size="large"
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
            endIcon={<Close />}
          >
            Close
          </Button>
        </Dialog>
      </>
    );
};

const styles = {
  notes: {
    textAlign: "center",

    fontStyle: "italic",
    padding: 5,
  },
  exerciseTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    padding: 2,
    paddingLeft: "5px  ",
    paddingRight: "5px",
    borderRadius: 5,
    backgroundColor: colors.primary,
    color: "white",
    noWrap: true,
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
