import Paper from "@mui/material/Paper";
import {
  Button,
  CircularProgress,
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
import useAxios from "../../hooks/useAxios";
import useProfile from "../../hooks/useProfile";




//**********   add a chart showing recent history

//if you check the history on the same day of the history it will not show up correctly
//something not working needs to be checked

const ExerciseHistory = ({
  currentExercise,
  modalHistory,
  setModalHistory,
  clientId
}) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);
  const { state } = useProfile();

  //api calls
  const controller = new AbortController();

  //get assignedCustomWorkouts
  const {
    loading,
    error,
    data: exerciseHistory,
  } = useAxios(
    {
      method: "get",
      url: `/clients/history/${clientId? clientId: state.profile.clientId}/${currentExercise?._id}`,

      signal: controller.signal,
    },
    controller,
    
  );



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

            {loading ? <CircularProgress/> : 
             (!loading &&!exerciseHistory) ? (
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
                {exerciseHistory?.history?.map((completedExercise, index) => {
                  return (
                    <MenuItem key={index + 2} value={index}>
                      {new Date(completedExercise.dateCompleted).toLocaleDateString()}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Paper sx={{ padding: 1 }}>
              <div style={{ padding: 0 }}>
                <h3>{currentExercise.name}</h3> 
                 {exerciseHistory.history?.length > 0 && exerciseHistory.history?.[selected]?.numOfSets?.map((set, idx) => {
                  return (
                    <>
                      <p key={idx}>
                        Set# {idx + 1} Weight: {set.weight}lbs Reps: {set.reps}
                      </p>
                     
                    </>
                  );
                })}
                 {exerciseHistory.history?.[selected]?.notes && <p>Exercise Notes: {exerciseHistory.history?.[selected]?.notes}</p>}
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
