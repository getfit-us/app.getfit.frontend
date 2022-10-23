import {  useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Checkbox, Divider, IconButton, List, ListItem,  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect } from "react";

const SuperSetModal = ({
  modalSuperSet,
  setModalSuperSet,
  exercise,
  superSetIndex,
  inStartWorkout,
  setFunctionMainArray,
  mainArray,
  superSet,
  inSuperSet,
}) => {

  const [checkedExercises, setCheckedExercises] = useState([]);
  // set checked exercise to all exercises if being opened from within a superset

  const handleClose = () => {
    setModalSuperSet(false);
  };

  const handleToggle = (id) => () => {
    let idx = checkedExercises.indexOf(id);

    if (checkedExercises.indexOf(id) === -1) {
      setCheckedExercises((prev) => [...prev, id]);
    } else if (checkedExercises.indexOf(id) !== -1) {
      setCheckedExercises((prev) => prev.filter((curid) => curid !== id));
    }
  };

  const handleSuperSet = () => {
    if (checkedExercises?.length <= 1 && !superSet) {
      // console.log("not in superset");
      //not inside a superset so we need more then one exercise to group
      handleClose();
      return false;
    }

    if (superSet?.length > 0) {
      // inside a superset
      if (checkedExercises?.length <= 1) {
        //then we need to move all the exercises inside the current superset back to reg state
        setFunctionMainArray((prev) => {
          let updated = [];
          if (inStartWorkout) {
            // console.log("inside 1 or less in start workout and superset");
            updated = JSON.parse(localStorage.getItem("startWorkout"));
            updated[0].exercises[superSetIndex].map((superSetexercise) =>
              updated[0].exercises.push(superSetexercise)
            );
            updated[0].exercises.splice(superSetIndex, 1); // remove the current superset
            localStorage.setItem("startWorkout", JSON.stringify(updated));
          } else {
            //means we are in created workout
            updated = JSON.parse(localStorage.getItem("NewWorkout"));

            updated[superSetIndex].map((exercise) => updated.push(exercise));
            updated.splice(superSetIndex, 1); // remove the current superset
            localStorage.setItem("NewWorkout", JSON.stringify(updated));
          }

          return updated;
        });
      } else if (checkedExercises?.length > 1) {
        // if there still is enough exercises in the current superset we need to only remove the unselected exercise
        let exerciseToDelete = []; //
        let updated = [];
        // console.log("inside superset and number of exercise > 1");

        setFunctionMainArray((prev) => {
          if (inStartWorkout) {
            //inside startWorkout
            updated = JSON.parse(localStorage.getItem("startWorkout"));
            updated[0].exercises[superSetIndex].map((superSetexercise) => {
              if (!checkedExercises.includes(superSetexercise._id)) {
                exerciseToDelete.push(superSetexercise._id);
                updated[0].exercises.push(superSetexercise);
              }
            });
            const filteredSuperset = updated[0].exercises[superSetIndex].filter(
              (superSetexercise) =>
                !exerciseToDelete.includes(superSetexercise._id)
            ); //
            updated[0].exercises[superSetIndex] = filteredSuperset; //
            localStorage.setItem("startWorkout", JSON.stringify(updated));
          } else {
            //inside created workout
            updated = JSON.parse(localStorage.getItem("NewWorkout"));
            updated[superSetIndex].map((exercise) => {
              if (!checkedExercises.includes(exercise._id)) {
                exerciseToDelete.push(exercise._id); // makr for deletion
                updated.push(exercise); // add to original array
              }
            });
            const filteredSuperset = updated[superSetIndex].filter(
              (exercise) => !exerciseToDelete.includes(exercise._id)
            ); //
            updated[superSetIndex] = filteredSuperset; //
            localStorage.setItem("NewWorkout", JSON.stringify(updated));
          }
          return updated;
        });
      }
    } else {
      // not in superset
      //loop through startworkout array and add selected to superset state (each superset will be a array inside the array because we are going to be able to have more then one superset if needed)
      setFunctionMainArray((prev) => {
        let updated = [];
        let newSuperSetArr = [];
        if (inStartWorkout) {
          updated = JSON.parse(localStorage.getItem("startWorkout"));
          //loop through startworkout array and add selected to superset array
          updated[0].exercises.forEach((exercise) => {
            if (checkedExercises.includes(exercise._id)) {
              // if found we are going to group into new array and push to superset array
              newSuperSetArr.push(exercise);
            }
          });

          updated[0].exercises = updated[0].exercises.filter(
            (exercise) => !checkedExercises.includes(exercise._id)
          ); //
          updated[0].exercises.push(newSuperSetArr);
          localStorage.setItem("startWorkout", JSON.stringify(updated));
          //
        } else {
          updated = JSON.parse(localStorage.getItem("NewWorkout")); // use localStorage instead

          //loop through startworkout array and add selected to superset array
          updated.forEach((exercise) => {
            if (checkedExercises.includes(exercise._id)) {
              // if found we are going to group into new array and push to superset array
              newSuperSetArr.push(exercise);
            }
          });
          updated = updated.filter(
            (exercise) => !checkedExercises.includes(exercise._id)
          ); //

          updated.push(newSuperSetArr);
          localStorage.setItem("NewWorkout", JSON.stringify(updated));
        }

        return updated;
      });
    }
    setCheckedExercises([])
    handleClose(); //
  };

  useEffect(() => {
    if (superSet) {
      //if in superset on load check all exercises in the superset
      setCheckedExercises(() => {
        let checked = [];
        superSet.map((exercise) => checked.push(exercise._id));
        return checked;
      });
    }
  },[superSet?.length]);

  // this component needs to be changed from datagrid to just a list of exercise checkboxes
  return (
    <div>
      <Modal
        open={modalSuperSet}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.container}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {superSet
              ? "Uncheck to Remove From Super Set"
              : "Create Super Set or Giant Set"}
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            style={style.close}
          >
            <CloseIcon />
          </IconButton>
          <List>
            {inStartWorkout && !superSet // in startworkout not in superset
              ? mainArray[0]?.exercises.map((exercise) => {
                  return (
                    !Array.isArray(exercise) && (
                      <>
                      <ListItem
                        key={exercise._id}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(exercise._id)}
                            checked={
                              checkedExercises.indexOf(exercise._id) !== -1
                            }
                            inputProps={{ "aria-labelledby": exercise._id }}
                          />
                        }
                        disablePadding
                      >
                        {exercise.name}
                      </ListItem>
                      <Divider />
                      </>
                    )
                  );
                })
              : !superSet && // this is in create workout
                mainArray.map((exercise) => {
                  return (
                    !Array.isArray(exercise) && (
                      <>
                      <ListItem
                        key={exercise._id}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(exercise._id)}
                            checked={
                              checkedExercises.indexOf(exercise._id) !== -1
                            }
                            inputProps={{ "aria-labelledby": exercise._id }}
                          />
                        }
                        disablePadding
                      >
                        {exercise.name}
                      </ListItem>
                        <Divider/>
                        </>
                    )
                  );
                })}
            {superSet && // this is in superset
              superSet.map((exercise) => {
                return (
                  !Array.isArray(exercise) && (
                    <>
                    <ListItem
                      key={exercise._id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(exercise._id)}
                          checked={
                            checkedExercises.indexOf(exercise._id) !== -1
                          }
                          inputProps={{ "aria-labelledby": exercise._id }}
                        />
                      }
                      disablePadding
                    >
                      {exercise.name}
                    </ListItem>
                    <Divider/>
                    </>
                  )
                );
              })}
          </List>

          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20 }}
            onClick={handleSuperSet}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {xs: '95%', sm: '70%', md: '50%',},
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: 2,
  },
  form: {
    p: 3,
  },
  close: {
    position: "fixed",
    top: 0,
    right: 0,
  },
};

export default SuperSetModal;
