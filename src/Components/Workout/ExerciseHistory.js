import Paper from "@mui/material/Paper";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Close } from "@mui/icons-material";

const rows = [];
function findAllByKey(obj, keyToFind) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}

//**********   add a chart showing recent history

//if you check the history on the same day of the history it will not show up correctly
//something not working needs to be checked

const ExerciseHistory = ({
  exerciseHistory,
  currentExercise,
  modalHistory,
  setModalHistory,
}) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);

  // // extract dates from array
  // let dates = exerciseHistory[currentExercise]?.map((exercise) => {
  //   return findAllByKey(exercise, "dateCompleted");
  // });

  console.log(exerciseHistory, currentExercise)
  return (
    <>
      <Dialog
        //Show Exercise History
        open={modalHistory}
        onClose={handleCloseHistoryModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll="paper"
      >
        <Grid container>
          <Grid item xs={12} sx={{ position: "relative" }}>
            {" "}
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ p: 1 }}
            >
              Exercise History
            </Typography>
            <IconButton
              aria-label="Close"
              onClick={handleCloseHistoryModal}
              style={{
                position: "fixed",
                top: 10,
                right: 0,
              }}
            >
              <Close />
            </IconButton>
          </Grid>

          {/* loop over history state array and return Drop down Select With Dates */}
          <DialogContent>
            {!Object.keys(exerciseHistory).length > 0 ? (
              <Paper elevation={5} sx={{ borderRadius: 10 }}>
                <h4 style={{ padding: 1, textAlign: "center" }}>
                  {" "}
                  No Exercise History Found
                </h4>
              </Paper>
            ) : (
              <>
            <Grid item xs={12}>
              <TextField
                select
                label="Date"
                defaultValue={0}
                fullWidth
                onChange={(e) => {
                  setSelected(e.target.value);
                }}
              >
                {exerciseHistory[currentExercise._id]?.map((completedExercise, index) => {
                  return (
                    <MenuItem key={index + 2} value={index}>
                      {completedExercise.dateCompleted}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Paper sx={{ padding: 1 }}>
              <div style={{ padding: 0 }}>
                <h3>{currentExercise.name}</h3> 
                 {exerciseHistory[currentExercise._id]?.length > 0 && exerciseHistory[currentExercise._id][selected]?.numOfSets?.map((set, idx) => {
                  return (
                    <>
                      <p key={idx}>
                        Set# {idx + 1} Weight: {set.weight}lbs Reps: {set.reps}
                      </p>
                    </>
                  );
                })}
              </div>
             
            </Paper>
            </>)}
          </DialogContent>
          <Grid item xs={12} sx={{ mb: 1, mt: 1, textAlign: "center" }}>
            {" "}
            <Button
              variant="contained"
              size="medium"
              color="warning"
              sx={{ borderRadius: 20, mt: 1 }}
              onClick={() => {
                handleCloseHistoryModal();
              }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default ExerciseHistory;
