import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useProfile from "../../hooks/useProfile";
import { Checkbox, IconButton, List, ListItem, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";

const SuperSetModal = ({
  modalSuperSet,
  setModalSuperSet,
  startWorkout,
  superSet,
  setStartWorkout,
  exerciseId,
  inSuperSet,
}) => {
  const { state, dispatch } = useProfile();
  const allExercises = startWorkout.map((exercise) => exercise._id)

  const [checkedExercises, setCheckedExercises] = useState( inSuperSet ? allExercises : []
   
  ); // set checked exercise to all exercises if being opened from within a superset


  const handleClose = () => {
    setModalSuperSet(false);
  };

  const handleToggle = (id) => () => {
    let idx = checkedExercises.indexOf(id)


    if (inSuperSet) { 
     // then when we uncheck exercises we need to take them out of the superset and place them back in regular state
     // if there is not more then one exercise then its not longer a superset and all the exercies need to be taken out and put back

      
      
    } else if (checkedExercises.indexOf(id) === -1) {
      setCheckedExercises(prev => [...prev, id]);


  } else if (checkedExercises.indexOf(id) !== -1) {
    setCheckedExercises(prev => prev.splice(idx, 1));
  }
}

  const handleSuperSet = () => {
    if (inSuperSet) {
      const numOfExercises = checkedExercises.length // get number of exercises
      if (numOfExercises === 1) { //then we need to move all the exercises inside the current superset back to reg state
        setStartWorkout((prev) => {
          let updated = JSON.parse(JSON.stringify(prev))
          startWorkout.map((workout) => updated.push(workout));
          return updated;
        })
      } else if (numOfExercises > 1) {
        
      }

    } else {

    //loop through startworkout array and add selected to superset state (each superset will be a array inside the array because we are going to be able to have more then one superset if needed)
    setStartWorkout((prev) => {
      let updated = JSON.parse(JSON.stringify(prev))

      let newSuperSetArr = [];
      //loop through startworkout array and add selected to superset array  
      startWorkout.forEach((exercise) => {
        if (checkedExercises.includes(exercise._id)) {
          // if found we are going to group into new array and push to superset array
          newSuperSetArr.push(exercise);
        }
      });
      let filtered = updated.filter((exercise) => !checkedExercises.includes(exercise._id)); //



      filtered.push(newSuperSetArr);
      return filtered;
    });

    }



   
  };


  // this component needs to be changed from datagrid to just a list of exercise checkboxes





console.log(checkedExercises.length)

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
            Create Super Set or Giant Set
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            style={style.close}
          >
            <CloseIcon />
          </IconButton>
          <List>
    {startWorkout.map(exercise => {
      return !Array.isArray(exercise) && (
        <ListItem
          key={exercise._id}
          secondaryAction={
            <Checkbox
              edge="end"
              onChange={handleToggle(exercise._id)}
              checked={checkedExercises.indexOf(exercise._id) !== -1}
              inputProps={{ 'aria-labelledby': exercise._id }}
            />
          }
          disablePadding
          >{exercise.name}</ListItem>
          
      )

    })}
    </List>

    
         

          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20 }}
            onClick={handleSuperSet}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
)
};

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
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
