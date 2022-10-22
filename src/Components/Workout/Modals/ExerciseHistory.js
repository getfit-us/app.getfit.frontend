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
  status,
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
      maxWidth='xs'
      fullWidth={true}
    PaperProps={{minWidth: "75%", maxHeight: 500}}
    >
      
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
      <DialogContent dividers >
       <div className="dialog-content">
            <TextField
              select
              label="Date"
             value={selected}
              fullWidth
              onChange={(e) => {
                setSelected(e.target.value);
              }}
            >
              {status?.loading ? <CircularProgress/> : exerciseHistory?.history?.map((completedExercise, index) => {
                return (
                  <MenuItem key={index + 2} value={index}>
                    {new Date(
                      completedExercise.dateCompleted
                    ).toLocaleDateString()}
                  </MenuItem>
                );
              })}
            </TextField>

          <h3>{exerciseHistory?.history[0]?.name}</h3>
          {exerciseHistory?.history?.length > 0 &&
            exerciseHistory?.history?.[selected]?.numOfSets?.map((set, idx) => {
              return (
                <>
                  <p key={idx}>
                   <span className="title">Set:</span>  <span className="info">{idx + 1}</span> <span className="title"> Weight:</span> <span className="info">{set.weight}lbs</span> <span className="title">Reps:</span><span className="info">{set.reps}</span>
                  </p>
                </>
              );
            })}
          {exerciseHistory?.history?.[selected]?.notes && (
            <p><span className="title">Exercise Notes:</span> <span className="info">{exerciseHistory?.history?.[selected]?.notes}</span></p>
          )}
          </div>
      </DialogContent>
      
        {" "}
        <div className="container">  <Button
          variant="contained"
          size="medium"
          color="warning"
          sx={{ borderRadius: 20, mt: 1, mb: '1rem' }}
          onClick={() => {
            setSelected(0);
            handleCloseHistoryModal();

          }}
        >
          Close
        </Button></div>
      
      
    </Dialog>
  );
};

export default ExerciseHistory;
