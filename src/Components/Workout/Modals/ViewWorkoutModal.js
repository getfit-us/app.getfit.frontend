import { Close, Comment, Star } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  DialogActions,
  IconButton,
  Rating,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { colors } from "../../../Store/colors";

const RenderSuperset = ({ exercise, index }) => {
  return (
    <div key={"superset" + index} className="flex flex-column flex-center"
    style={{
      border: `6px solid  ${colors.primaryLight}`,
      borderRadius: "5px",
      marginBottom: '.5rem',
     
    }}
    >
      <h3
        key={"superset h3" + index}
        style={{
          padding: 3,
          backgroundColor: colors.primaryLight,
          width: "100%",
          textAlign: "center",
          margin: 0,
          color: "white",
          marginBottom: ".5rem",
         
        }}
      >
        SuperSet
      </h3>

      {exercise.map((superSetExercise, supersetIndex) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: ".5rem",
              width: "100%",
             
            }}
            key={superSetExercise._id + "div"}
          >
            <h4
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: ".5rem",
                        backgroundColor: colors.primary,
                        color: "white",
                        boxShadow: "0px 2px 2px 0px grey",
                        margin: 0,
                      }}
                      key={superSetExercise._id + "exercise span name"}
                    >
              {superSetExercise?.name}
              </h4>

            {superSetExercise?.numOfSets?.map((sset, i) => {
              return (
                <p key={exercise._id + "set" + i} style={styles.set}>
                <span style={styles.field}>Set #{i+1} Weight: </span>
                <span style={styles.data}>
                  {" "}
                  {sset.weight} (lbs){" "}
                </span>{" "}
                <span style={styles.field}>Reps: </span>
                <span style={styles.data}>{sset.reps}</span>
              </p>
              );
            })}
            {exercise?.notes?.length > 0 && (
             <div className="flex flex-column flex-center">
             <h3
               style={{
                 margin: 0,
               }}
             >
               {" "}
               Exercise Notes{" "}
             </h3>
             <Comment />
             <p style={styles.notes}>{exercise?.notes}</p>
           </div>
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
          maxWidth="sm"
          fullWidth
        >
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: ".5rem",
              width: "100%",
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

            <p>
              {" "}
              <span
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  textDecoration: "underline",
                  paddingLeft: ".5rem",
                  paddingRight: ".5rem",
                  display: "block",
                }}
              >
                {viewWorkout[0]?.dateCompleted
                  ? "Date Completed"
                  : "Date Created"}{" "}
              </span>
              <span
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {" "}
                {viewWorkout[0]?.dateCompleted
                  ? new Date(viewWorkout[0]?.dateCompleted).toDateString()
                  : new Date(viewWorkout[0]?.Created).toDateString()}
              </span>
            </p>

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

            <DialogContent
              dividers
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
                  <RenderSuperset exercise={exercise} index={idx} key={idx} />
                ) : exercise.type === "cardio" ? (
                  <div
                    className="
                  flex flex-column flex-center
                  "
                  >
                    <h4
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: ".5rem",
                        backgroundColor: colors.primary,
                        color: "white",
                        boxShadow: "0px 2px 2px 0px grey",
                        margin: 0,
                      }}
                      key={exercise._id + "exercise span name"}
                    >
                      {exercise.name}
                    </h4>
                    <p
                      style={styles.set}
                      className="flex flex-center flex-column"
                    >
                      <span style={styles.field} key={exercise._id + "level"}>
                        Level
                      </span>
                      <span style={styles.data}>{exercise.level}</span>
                      <span style={styles.field} key={exercise._id + "minutes"}>
                        Minutes
                      </span>
                      <span style={styles.data}>
                        {exercise.numOfSets[0].minutes} (mins)
                      </span>
                      <span
                        style={styles.field}
                        key={exercise._id + "heartRate"}
                      >
                        Heart Rate
                      </span>
                      <span style={styles.data}>
                        {exercise.numOfSets[0].heartRate} (BPM)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div
                    key={exercise._id + "exercise Div"}
                    className="flex flex-column flex-center"
                  >
                    <h4
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: ".5rem",
                        backgroundColor: colors.primary,
                        color: "white",
                        boxShadow: "0px 2px 2px 0px grey",
                        margin: 0,
                      }}
                    >
                      {exercise?.name}
                    </h4>

                    {exercise?.numOfSets?.map((set, i) => (
                      <p key={exercise._id + "set" + i} style={styles.set}>
                        <span style={styles.field}>Set #{i+ 1} Weight: </span>
                        <span style={styles.data}>
                          {" "}
                          {set.weight} (lbs){" "}
                        </span>{" "}
                        <span style={styles.field}>Reps: </span>
                        <span style={styles.data}>{set.reps}</span>
                      </p>
                    ))}
                    {exercise?.notes?.length > 0 && (
                      <div className="flex flex-column flex-center">
                        <h3
                          style={{
                            margin: 0,
                          }}
                        >
                          {" "}
                          Exercise Notes{" "}
                        </h3>
                        <Comment />
                        <p style={styles.notes}>{exercise?.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </DialogContent>
          </div>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
          </DialogActions>
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
  data: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: "1.1rem",
    color: "#083a8a",
  },
  field: {
    fontWeight: "bold",
  },
  set: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: ".5rem",
    padding: ".3rem",
  },
};

export default ViewWorkoutModal;
