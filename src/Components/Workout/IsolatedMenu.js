import { Close, MoreVert, TextSnippet } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import SuperSetModal from "./SuperSetModal";

// component used in the create a custom workout for multiple menus inside of a map func

const IsolatedMenu = ({


  exercise,
  superSet,
  inSuperSet,
  mainArray,
  setFunctionMainArray,
  inStartWorkout,
  superSetIndex,
}) => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const isMenuOpen = Boolean(anchorMenu);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuperSet, setModalSuperSet] = useState(false);

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
      {exercise?.notes ? (
        <Tooltip title="Notes">
          <IconButton
            sx={{
              position: "absolute",
              top: 40,
              right: 0,
              display: { xs: { top: 30, right: 0 } },
            }}
            onClick={handleOpenModal}
          >
            <TextSnippet />
          </IconButton>
        </Tooltip>
      ) : null}
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
            if (inSuperSet) {
              // menu inside renderSuperSet
              // now loop over array of sets indexes

              setFunctionMainArray((prev) => {
                let updated = [];
                if (inStartWorkout) {
                  updated = JSON.parse(localStorage.getItem("startWorkout"));
                  updated[0].exercises[superSetIndex] = updated[0].exercises[
                    superSetIndex
                  ].filter((e) => e._id !== exercise._id);
                  if (updated[0].exercises[superSetIndex].length === 1) {
                    //add superset to main array
                    updated[0].exercises.push(
                      updated[0].exercises[superSetIndex][0]
                    );
                    updated[0].exercises.splice(superSetIndex, 1);
                  }
                } else {
                  updated = JSON.parse(localStorage.getItem("NewWorkout"));
                  updated[superSetIndex] = updated[superSetIndex].filter(
                    (e) => e._id !== exercise._id
                  );
                  if (updated[superSetIndex].length === 1) {
                    //add superset to main array
                    updated.push(updated[superSetIndex][0]);
                    updated.splice(superSetIndex, 1);
                  }
                }

                //check length of updated superset array if its == 1 then its no longer a superset and needs to be moved back to main array

                inStartWorkout
                  ? localStorage.setItem(
                      "startWorkout",
                      JSON.stringify(updated)
                    )
                  : localStorage.setItem("NewWorkout", JSON.stringify(updated));

                return updated;
              });
            } else {
              //----menu selected outside of renderSuperset ----
              setFunctionMainArray((prev) => {
                let updated = [];
                if (inStartWorkout) {
                  console.log("inside startWorkout delete");
                  updated = JSON.parse(localStorage.getItem("startWorkout"));
                  updated[0].exercises = updated[0].exercises.filter(
                    (e) => e._id !== exercise._id
                  );
                  localStorage.setItem("startWorkout", JSON.stringify(updated));
                } else {
                  updated = JSON.parse(localStorage.getItem("NewWorkout"));
                  updated = updated.filter((e) => e._id !== exercise._id);
                  localStorage.setItem("NewWorkout", JSON.stringify(updated));
                }

                return updated;
              });
            }

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
          Create note
        </MenuItem>
        <MenuItem
          onClick={() => {
            setModalSuperSet(true);
            handleCloseMenu();
          }}
        >
          SuperSet
        </MenuItem>
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
              id={exercise._id}
              type="text"
              multiline
              minRows={3}
              fullWidth
              label="Exercise Notes"
              defaultValue={exercise.notes}
            />
          </div>
          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20, mt: 1 }}
            onClick={() => {
              if (inSuperSet) {
                // menu called inside render superset

                setFunctionMainArray((prev) => {
                  let updated = [];
                  const notes = document.getElementById(exercise._id).value;
                  if (inStartWorkout) {
                    updated = JSON.parse(localStorage.getItem("startWorkout"));

                    updated[0].exercises[superSetIndex].map((e) => {
                      if (e._id === exercise._id) {
                        e.notes = notes;
                      }
                    });
                    localStorage.setItem(
                      "startWorkout",
                      JSON.stringify(updated)
                    );
                  } else {
                    //in created workout render superset
                    updated = JSON.parse(localStorage.getItem("NewWorkout"));
                    updated[superSetIndex].map((e) => {
                      if (e._id === exercise._id) {
                        e.notes = notes;
                      }
                    });
                    localStorage.setItem("NewWorkout", JSON.stringify(updated));
                  }

                  return updated;
                });
              } else {
                // not being called from render superset
                setFunctionMainArray((prev) => {
                  let updated = [];
                  const notes = document.getElementById(exercise._id).value;
                  if (inStartWorkout) {
                    updated = JSON.parse(localStorage.getItem("startWorkout"));
                    updated[0].exercises.map((e) => {
                      if (e._id === exercise._id) {
                        e.notes = notes;
                      }
                    });
                    localStorage.setItem(
                      "startWorkout",
                      JSON.stringify(updated)
                    );
                  } else {
                    updated = JSON.parse(localStorage.getItem("NewWorkout"));
                    updated.map((e) => {
                      if (e._id === exercise._id) {
                        e.notes = notes;
                      }
                    });
                    localStorage.setItem("NewWorkout", JSON.stringify(updated));
                  }

                  return updated;
                });
              }

              handleCloseModal();
            }}
          >
            Save Notes
          </Button>
        </Box>
      </Modal>
      <SuperSetModal
        modalSuperSet={modalSuperSet}
        setModalSuperSet={setModalSuperSet}
        mainArray={mainArray} // this is about the equivalent to the array startWorkout from the (StartWorkout component)
        setFunctionMainArray={setFunctionMainArray} // this is about the equivalent to the array startWorkout from the (StartWorkout component)
        superSet={superSet}
        exercise={exercise}
        inSuperSet={inSuperSet}
        inStartWorkout={inStartWorkout}
        superSetIndex={superSetIndex}
      />
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
