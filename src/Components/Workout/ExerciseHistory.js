import Paper from "@mui/material/Paper";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Close } from "@mui/icons-material";

//**********   add a chart showing recent history

//if you check the history on the same day of the history it will not show up correctly
//something not working needs to be checked

const ExerciseHistory = ({
  modalHistory,
  setModalHistory,
  exerciseHistory,
  loading,
}) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);

  return (
    <Dialog
      //Show Exercise History
      open={modalHistory}
      onClose={handleCloseHistoryModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll="body"
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      {" "}
      <DialogTitle
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{
          textAlign: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Exercise History
      </DialogTitle>
      {/* loop over history state array and return Drop down Select With Dates */}
      <DialogContent dividers>
        <Grid container gap={1} sx={{ width: "300px" }}>
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
              {exerciseHistory?.history?.map((completedExercise, index) => {
                return (
                  <MenuItem key={index + 2} value={index}>
                    {new Date(
                      completedExercise.dateCompleted
                    ).toLocaleDateString()}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          <h3>{exerciseHistory?.history[0]?.name}</h3>
          {exerciseHistory?.history?.length > 0 &&
            exerciseHistory?.history?.[selected]?.numOfSets?.map((set, idx) => {
              return (
                <>
                  <p key={idx}>
                    Set# {idx + 1} Weight: {set.weight}lbs Reps: {set.reps}
                  </p>
                </>
              );
            })}
          {exerciseHistory?.history?.[selected]?.notes && (
            <p>Exercise Notes: {exerciseHistory?.history?.[selected]?.notes}</p>
          )}
        </Grid>
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
    </Dialog>
  );
};

export default ExerciseHistory;
