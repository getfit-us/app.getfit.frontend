import { Button, CircularProgress, Grid, TextField } from "@mui/material";

import { useState, useEffect } from "react";
import AddExerciseForm from "../AddExerciseForm";
import useProfile from "../../../hooks/useProfile";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import { useNavigate } from "react-router-dom";
import RenderExercises from "./RenderExercises";

const CreateWorkout = ({ manageWorkout }) => {
  //need to ask if you want to save or leave page for new workout

  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [saveError, setSaveError] = useState(false);
  // superset
  const navigate = useNavigate();
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [status, setStatus] = useState({
    isError: false,
    success: false,
    loading: false,
  });

  const axiosPrivate = useAxiosPrivate();

  // -------------------api call to save workout--
  const onSubmit = async (workout) => {
    let isMounted = true;
    setStatus({
      show: false,
      isError: false,
      loading: true,
      success: false,
    });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/custom-workout", workout, {
        signal: controller.signal,
      });
      localStorage.removeItem("NewWorkout"); //remove current workout from localStorage
      dispatch({ type: "ADD_CUSTOM_WORKOUT", payload: response.data });
      dispatch({ type: "MANAGE_WORKOUT", payload: [] });
      setStatus({
        isError: false,
        loading: false,
        success: true,
      });
      navigate("/dashboard/overview");

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({
        isError: true,
        loading: false,
        success: false,
      });
      if (err.response.status === 409) {
        setSaveError((prev) => !prev);
        setTimeout(() => setSaveError((prev) => !prev), 5000);
      }
    }

    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  useEffect(() => {
    // going to add something for localStorage here later
    if (state.manageWorkout) {
      localStorage.setItem("NewWorkout", JSON.stringify(state.manageWorkout));
      setAddExercise(state.manageWorkout);
    } else {
      localStorage.setItem("NewWorkout", JSON.stringify(addExercise));
    }
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    buttonExercise: {
      borderRadius: "10px",
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
  document.title = `Create Workout - ${state.newWorkout.name}`;

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid
        item
        xs={12}
        sm={5}
        sx={{ justifyContent: "center", textAlign: "center", mb: 2 }}
      >
        <TextField
          style={{ justifyContent: "center" }}
          type="text"
          defaultValue={state.newWorkout.name}
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

          <Grid item xs={12} sx={{ textAlign: "center", margin: 5 }}>
            {status.error ? (
              <Button variant="contained" color="error">
                Error Duplicate Workout Name
              </Button>
            ) : status.loading ? (
              <CircularProgress size={100} color="success" />
            ) : (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  let workout = {};
                  const getFormName =
                    document.getElementById("WorkoutName").value;
                  //get workout from localStorage
                  const updated = JSON.parse(
                    localStorage.getItem("NewWorkout")
                  );
                  workout.exercises = updated; // add exercises to workout
                  workout.name = getFormName
                    ? getFormName
                    : state.newWorkout.name; // add name to workout
                  workout.id = state.profile.clientId;

                  onSubmit(workout);
                }}
                sx={{ borderRadius: 10 }}
              >
                Save Changes
              </Button>
            )}
          </Grid>
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
          sx={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
        >
          <Button
            variant="contained"
            onClick={() => setShowTabs((prev) => !prev)}
            style={styles.buttonExercise}
          >
            Add Exercise
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default CreateWorkout;
