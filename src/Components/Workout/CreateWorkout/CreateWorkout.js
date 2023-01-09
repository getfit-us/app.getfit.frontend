import { useState, useEffect } from "react";
import AddExerciseForm from "../AddExerciseForm";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";

import { useNavigate } from "react-router-dom";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../../Store/Store";
import { saveNewCustomWorkout } from "../../../Api/services";
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
  const handleSaveWorkout = (workout) => {
    setStatus({
      show: false,
      error: false,
      loading: true,
      success: false,
    });
    workout.Created = new Date().toLocaleString();

    saveNewCustomWorkout(axiosPrivate, workout).then((response) => {
      setStatus({ loading: response.loading, error: response.error });
      if (response.error) {
        setStatus({
          error: true,
          loading: false,
          message: response.error.message,
        });
      } else {
        localStorage.removeItem("NewWorkout"); //remove current workout from localStorage
        addCustomWorkout(response.data);
        setManageWorkout([]);
        setStatus({
          isError: false,
          loading: false,
          success: true,
        });
        navigate("/dashboard/overview");
      }
    });
  };

  const updateCustomWorkout = async (data) => {
    const controller = new AbortController();
    setStatus((prev) => ({ ...prev, loading: true }));
    data.Created = new Date().toLocaleString();
    try {
      const response = await axiosPrivate.put(`/custom-workout`, data, {
        signal: controller.signal,
      });
      updateCustomWorkoutState(response.data);
      // console.log(response.data);
      setStatus((prev) => ({ ...prev, loading: false }));
      setManageWorkout([]);
      navigate("/dashboard/overview");
      // reset();
    } catch (err) {
      console.log(err);

      return () => {
        controller.abort();
        setStatus((prev) => ({ ...prev, loading: false }));
      };
    }
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
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    buttonExercise: {
      borderRadius: 20,
      m: 2,
    },
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
    close: {
      position: "fixed",
      top: 0,
      right: 0,
    },
    header: {
      display: "flex",
      justifyContent: "center",
    },
  };

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{ justifyContent: "center", textAlign: "center", mb: 2 }}
      >
        <TextField
          style={{ justifyContent: "center" }}
          type="text"
          defaultValue={
            manageWorkoutState?.name
              ? manageWorkoutState?.name
              : newWorkout.name
          }
          label="Workout Name"
          id="WorkoutName"
          variant="outlined"
          fullWidth
        />
      </Grid>

      {addExercise?.length !== 0 && (
        <>
          <RenderExercises
            addExercise={addExercise}
            setAddExercise={setAddExercise}
          />

         
        </>
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
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-evenly", marginBottom: 8,
        gap: 1 }}
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
                onClick={(e) => {
                  let workout = {};
                  const getFormName =
                    document.getElementById("WorkoutName").value;
                  //get workout from localStorage
                  const updated = JSON.parse(
                    localStorage.getItem("NewWorkout")
                  );
                  workout.exercises = updated; // add exercises to workout
                  workout.name = getFormName ? getFormName : newWorkout.name; // add name to workout
                  workout.id = profile.clientId;

                  handleSaveWorkout(workout);
                }}
              
              >
                {status.loading ? "Saving.." : status.error ? status.message : "Save Workout"}{" "}
              </Button>
              {manageWorkoutState?.name && (
            <Button
              variant="contained"
              color="success"
              onClick={(e) => {
                let workout = {};

                const getFormName =
                  document.getElementById("WorkoutName").value;
                //get workout from localStorage
                const updated = JSON.parse(localStorage.getItem("NewWorkout"));
                workout.exercises = updated; // add exercises to workout
                workout.name = getFormName ? getFormName : newWorkout.name; // add name to workout
                workout.id = profile.clientId;
                workout.assignedIds = manageWorkoutState?.assignedIds;
                workout._id = manageWorkoutState?._id;
                workout.Created = manageWorkoutState?.Created;
                updateCustomWorkout(workout);
              }}
              
            >
              Update Workout
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default CreateWorkout;
