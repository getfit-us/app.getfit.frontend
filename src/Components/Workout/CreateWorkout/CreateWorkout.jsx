import { useState, useEffect } from "react";
import AddExerciseForm from "../AddExerciseForm";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Button, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../../Store/Store";
const CreateWorkout = ({ manageWorkout }) => {
  //need to ask if you want to save or leave page for new workout
  const profile = useProfile((state) => state.profile);
  const addCustomWorkout = useWorkouts((state) => state.addCustomWorkout);
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const manageWorkoutState = useWorkouts((state) => state.manageWorkout);
  const newWorkout = useWorkouts((state) => state.newWorkout);
  const updateCustomWorkoutState = useWorkouts(
    (state) => state.updateCustomWorkout
  );
  const handleSaveCustomWorkout = useWorkouts(
    (state) => state.handleSaveCustomWorkout
  );
  const handleUpdateCustomWorkout = useWorkouts(
    (state) => state.handleUpdateCustomWorkout
  );
  const [showTabs, setShowTabs] = useState(false);
  const [saveError, setSaveError] = useState(false);
  // superset
  const navigate = useNavigate();
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [status, setStatus] = useState({
    error: false,
    success: false,
    loading: false,
  });

  const axiosPrivate = useAxiosPrivate();

  // -------------------api call to save workout--
  const handleSaveWorkout = () => {
    let workout = {};
    const getFormName = document.getElementById("WorkoutName").value;
    //get workout from localStorage
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));
    workout.exercises = updated; // add exercises to workout
    workout.name = getFormName ? getFormName : newWorkout.name; // add name to workout
    workout.id = profile.clientId;

    setStatus({
      show: false,
      error: false,
      loading: true,
      success: false,
    });
    workout.Created = new Date().toLocaleString();

    handleSaveCustomWorkout(workout).then((response) => {
      setStatus({ ...status, loading: false });

      localStorage.removeItem("NewWorkout"); //remove current workout from localStorage
      addCustomWorkout(response);
      setManageWorkout([]);
      setStatus({
        isError: false,
        loading: false,
        success: true,
      });
      navigate("/dashboard/overview");
    });
  };

  const updateCustomWorkout = async (workout) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    workout.Created = new Date().toLocaleString();
    handleUpdateCustomWorkout(workout);
    updateCustomWorkoutState(response.data);
    // console.log(response.data);
    setStatus((prev) => ({ ...prev, loading: false }));
    setManageWorkout([]);
    navigate("/dashboard/overview");
  };

  const handleUpdateWorkout = () => {
    let workout = {};

    const getFormName = document.getElementById("WorkoutName").value;
    //get workout from localStorage
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));
    workout.exercises = updated; // add exercises to workout
    workout.name = getFormName ? getFormName : newWorkout.name; // add name to workout
    workout.id = profile.clientId;
    workout.assignedIds = manageWorkoutState?.assignedIds;
    workout._id = manageWorkoutState?._id;
    workout.Created = manageWorkoutState?.Created;
    updateCustomWorkout(workout);
  };

  useEffect(() => {
    // going to add something for localStorage here later
    if (manageWorkoutState?.name) {
      localStorage.setItem(
        "NewWorkout",
        JSON.stringify(manageWorkoutState.exercises)
      );
      setAddExercise(manageWorkoutState.exercises);
    } else {
      localStorage.setItem("NewWorkout", JSON.stringify(addExercise));
    }

    document.title = `Create Workout - ${
      manageWorkoutState?.name ? manageWorkoutState?.name : newWorkout.name
    }`;
  }, []);

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
      p: 4,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "4rem",
        width: "100%",
      }}
    >
      <TextField
        style={{ maxWidth: "40rem", alignSelf: "center", margin: "1rem" }}
        type="text"
        defaultValue={
          manageWorkoutState?.name ? manageWorkoutState?.name : newWorkout.name
        }
        label="New Workout Name"
        id="WorkoutName"
        variant="outlined"
        fullWidth
        size="small"
      />

      {addExercise?.length !== 0 && (
        <RenderExercises
          addExercise={addExercise}
          setAddExercise={setAddExercise}
        />
      )}

      {showTabs ? (
        <AddExerciseForm
          setShowTabs={setShowTabs}
          addExercise={addExercise}
          setAddExercise={setAddExercise}
          checkedExerciseList={checkedExerciseList}
          setCheckedExerciseList={setCheckedExerciseList}
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowTabs((prev) => !prev)}
            style={styles.buttonExercise}
          >
            Add Exercise
          </Button>
          <Button
            variant="contained"
            disabled={status.loading}
            style={styles.buttonExercise}
            color="success"
            onClick={handleSaveWorkout}
          >
            {status.loading
              ? "Saving.."
              : status.error
              ? status.message
              : "Save Workout"}{" "}
          </Button>
          {manageWorkoutState?.name && (
            <Button
              variant="contained"
              color="success"
              onClick={handleUpdateWorkout}
            >
              Update Workout
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateWorkout;
