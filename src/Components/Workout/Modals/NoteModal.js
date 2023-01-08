import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

const NoteModal = ({ modalOpen, handleCloseModal, handleSave, exercise }) => {
  return (
    <Dialog
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-descriptionF"
    >
      <DialogTitle
        style={{
          textAlign: "center",
          backgroundColor: "#34adff",
          backgroundImage:
            "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
        }}
      >
        Exercise Notes
      </DialogTitle>

      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: '.5rem'
        }}
      >
        <TextField
          id={exercise._id}
          type="text"
          multiline
          autoFocus
          minRows={4}
          fullWidth
          label="Exercise Notes"
          defaultValue={exercise.notes}
          sx={{ mt: 2, mb: 2 }}
        />
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: "#34adff",
          backgroundImage:
            "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
            padding: '1rem'
        }}
      >
        <Button variant="contained" size="medium" onClick={handleSave}>
          Save Notes
        </Button>
        <Button
          variant="contained"
          size="medium"
          color="warning"
          onClick={handleCloseModal}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 6,
    p: 1,
  },
};

export default NoteModal;
