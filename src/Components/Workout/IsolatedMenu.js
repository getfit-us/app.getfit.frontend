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
import SuperSetModal from "./SuperSetModal";

const IsolatedMenu = ({
  e,
  startWorkout,
  setStartWorkout,
  index,
  setSuperSet,
  superSet,
}) => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const isMenuOpen = Boolean(anchorMenu);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenSuperSet, setModalOpenSuperSet] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const openMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  return (
    <>
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={openMenu}
      >
        <MoreVert />
      </IconButton>

      <Menu
        key={Object.keys(e).toString()}
        id="Options"
        aria-labelledby="Options"
        anchorEl={anchorMenu}
        open={isMenuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem
          key={Object.keys(e).toString()}
          onClick={() => {
            // need to make menu for adding notes , deleting exercise and grouping exercises into superset

            setStartWorkout((prev) => {
              const updated = [...prev];
              updated[0].exercises = updated[0].exercises.filter(
                (e) => e !== startWorkout[0].exercises[index]
              );
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
        <MenuItem
          onClick={() => {
            setModalOpenSuperSet(true);
            handleCloseMenu();
          }}
        >
          Create SuperSet
        </MenuItem>
      </Menu>
      <SuperSetModal
        superSet={superSet}
        modalOpenSuperSet={modalOpenSuperSet}
        setModalOpenSuperSet={setModalOpenSuperSet}
        startWorkout={startWorkout}
        setStartWorkout={setStartWorkout}
        setSuperSet={setSuperSet}
      />
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
              id={Object.keys(e).toString()}
              type="text"
              multiline
              minRows={3}
              fullWidth
              label="Exercise Notes"
              defaultValue={startWorkout[0].exercises[index].notes}
            />
          </div>
          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20, mt: 1 }}
            onClick={() => {
              // const updated = [...startWorkout]
              // const notes = document.getElementById(Object.keys(e).toString()).value;
              // console.log(updated[0].exercises[index])
              // updated[0].exercises[index].notes = notes;
              // console.log(updated[0].exercises[index])

              setStartWorkout((prev) => {
                const updated = [...prev];
                const notes = document.getElementById(
                  Object.keys(e).toString()
                ).value;
                updated[0].exercises[index].notes = notes;
                console.log(updated);
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
