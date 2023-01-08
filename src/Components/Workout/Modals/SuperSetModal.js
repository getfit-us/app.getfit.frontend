import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect } from "react";
import { colors } from "../../../Store/colors";
import { withTheme } from "@emotion/react";
import { Save } from "@mui/icons-material";

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
  let renderExercises = [];
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

        setFunctionMainArray((prev) => {
          if (inStartWorkout) {
            //inside startWorkout
            updated = JSON.parse(localStorage.getItem("startWorkout"));
            if (checkedExercises?.length < superSet?.length) {
              // we need to remove the unselected exercises
              updated[0].exercises[superSetIndex].map((superSetexercise) => {
                //loop through the current superset remove the unselected exercises
                if (!checkedExercises.includes(superSetexercise._id)) {
                  exerciseToDelete.push(superSetexercise._id);
                  updated[0].exercises.push(superSetexercise);
                }
              });
              const filteredSuperset = updated[0].exercises[
                superSetIndex
              ].filter(
                (superSetexercise) =>
                  !exerciseToDelete.includes(superSetexercise._id)
              ); //
              updated[0].exercises[superSetIndex] = filteredSuperset;
            } else if (checkedExercises.length > superSet.length) {
              // we need to add the selected exercises
              //check checked exercises length and superset length if checked is greater we need to add to existing superset

              updated[0].exercises.forEach((exercise) => {
                if (checkedExercises.includes(exercise._id)) {
                  updated[0].exercises[superSetIndex].push(exercise); // add to existing superset
                }
              });

              updated[0].exercises = updated[0].exercises.filter(
                (exercise) => !checkedExercises.includes(exercise._id) // remove from main array
              ); //
            }

            //
            localStorage.setItem("startWorkout", JSON.stringify(updated));
          } else {
            //inside created workout
            if (checkedExercises?.length < superSet?.length) {
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
            } else if (checkedExercises.length > superSet.length) {
              updated = JSON.parse(localStorage.getItem("NewWorkout"));
              updated.forEach((exercise) => {
                if (checkedExercises.includes(exercise._id)) {
                  updated[superSetIndex].push(exercise); // add to existing superset
                }
              });

              updated = updated.filter(
                (exercise) => !checkedExercises.includes(exercise._id) // remove from main array
              ); //
              localStorage.setItem("NewWorkout", JSON.stringify(updated));
            }
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
    setCheckedExercises([]);
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
  }, [superSet]);

  const renderSuperSet = superSet?.map((exercise) => {
    return (
      !Array.isArray(exercise) && (
        <>
          <ListItem key={exercise._id} disablePadding>
            <ListItemButton onClick={handleToggle(exercise._id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checkedExercises.indexOf(exercise._id) !== -1}
                  inputProps={{ "aria-labelledby": exercise._id }}
                  disableRipple
                />
              </ListItemIcon>
              {exercise.name}
            </ListItemButton>
          </ListItem>
        </>
      )
    );
  });

  inStartWorkout
    ? (renderExercises = mainArray[0]?.exercises.map((exercise) => {
        return (
          !Array.isArray(exercise) && (
            <>
              <ListItem key={exercise._id} disablePadding>
                <ListItemButton dense onClick={handleToggle(exercise._id)}>
                  <ListItemIcon>
                    <Checkbox
                      disableRipple
                      edge="start"
                      checked={checkedExercises.indexOf(exercise._id) !== -1}
                      inputProps={{ "aria-labelledby": exercise._id }}
                    />
                  </ListItemIcon>
                  {exercise.name}
                </ListItemButton>
              </ListItem>
            </>
          )
        );
      }))
    : (renderExercises = mainArray?.map((exercise) => {
        return (
          !Array.isArray(exercise) && (
            <>
              <ListItem key={exercise._id} disablePadding>
                <ListItemButton onClick={handleToggle(exercise._id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      disableRipple
                      checked={checkedExercises.indexOf(exercise._id) !== -1}
                      inputProps={{ "aria-labelledby": exercise._id }}
                    />
                  </ListItemIcon>
                  {exercise.name}
                </ListItemButton>
              </ListItem>
            </>
          )
        );
      }));

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
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {superSet
              ? "Uncheck to Remove or Check to Add"
              : "Check to Create SuperSet"}
          </p>

          <List
            style={{
              border: "2px solid black",
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: "1rem",
              backgroundColor: "white",
            }}
          >
            <p style={{
              textAlign: "center",
              fontWeight: "bold",
              textDecoration: "underline",

            }}>Exercises</p>

            {renderExercises}
            {superSet && (
              <div>
              
                <p style={{
              textAlign: "center",
              fontWeight: "bold",
              textDecoration: "underline",

            }}>Current SuperSet</p>
                <Divider />

                {renderSuperSet}

              </div>
            )}
          </List>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                alignSelf: "center",
              }}
              color="success"
              startIcon={<Save />}
              onClick={handleSuperSet}
            >
              Save
            </Button>
            <Button
              variant="contained"
              style={{
                alignSelf: "center",
              }}
              color="warning"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
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
    width: { xs: "95%", sm: "70%", md: "50%" },
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 2,
    backgroundColor: "#34adff",
    backgroundImage:
      "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
  },
};

export default SuperSetModal;
