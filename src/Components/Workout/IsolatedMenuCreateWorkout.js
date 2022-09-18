import { Close, MoreVert } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

// component used in the create a custom workout for multiple menus inside of a map func

const IsolatedMenu = ({ setAddExercise, addExercise, exerciseId }) => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const isMenuOpen = Boolean(anchorMenu);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const openMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  // get the current exercise
  let exercise = addExercise.filter(exercise => exercise._id === exerciseId)
  // console.log(exercise[0].notes);

  return (
    <>
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={openMenu}
      >
        <MoreVert />
      </IconButton>

      <Menu
        id="Options"
        aria-labelledby="Options"
        anchorEl={anchorMenu}
        open={isMenuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            setAddExercise((prev) => {
              let updated = [...prev];
              updated = updated.filter((e) => e._id !== exerciseId);
              return updated;
            });
            handleCloseMenu();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            //Show Modal for notes and save to state under current exercise
            handleOpenModal();
            handleCloseMenu();
          }}
        >
          Notes
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>Create SuperSet</MenuItem>
      </Menu>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ p: 1 }}
          >
            Add Notes
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleCloseModal}
            style={styles.close}
          >
            <Close />
          </IconButton>
          <div style={styles.form}>
            <TextField
              id={exerciseId}
              type="text"
              multiline
              minRows={3}
              fullWidth
              label="Exercise Notes"
              defaultValue={exercise[0]?.notes}
            />
          </div>
          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20, mt: 1 }}
            onClick={() => {
            //   const updated = [...addExercise];
            //   const notes = document.getElementById(exerciseId).value;
            //  updated.map((e) => {

            //   if (e._id === exerciseId) {
            //     e.notes = notes;
            //   }
            //  })
            //  console.log(updated)

              setAddExercise((prev) => {
                const updated = [...prev];
                const notes = document.getElementById(exerciseId).value;
                updated.map((e) => {

                  if (e._id === exerciseId) {
                    e.notes = notes;
                  }
                 })
                return updated;
              });
              handleCloseModal();
            }}
          >
            Save Notes
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 10,
    p: 4,
  },
  form: {
    p: 3,
  },
  close: {
    position: "fixed",
    top: 5,
    right: 10,
  },
};

export default IsolatedMenu;
