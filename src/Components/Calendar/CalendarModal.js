import { Close, EventRepeat, Star } from "@mui/icons-material";
import { Autocomplete, Button, Grid, MenuItem, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { options } from "dropzone";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import {format} from 'date-fns'

const CalendarModal = ({ handleModal, open, currentDate }) => {
  const [type, setType] = useState('select');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    unregister,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    if (state?.profile?.trainerId) {
      setType("goal")
      if (type === "goal") {
        unregister("taskType")
        unregister("taskDate")
      } else {
        unregister('start')
        unregister('end')
        unregister('title')
      }
    }
  }, [type]);

  const onSubmit = async (event) => {
    if (type === "task") {
      event.id = selectedClient._id;
      event.title = event.taskType
      event.activityId = selectedTask._id
      event.end = new Date(event.taskDate.replace(/-/g, '\/'))
    } else {
      event.id = state.profile.clientId;

      event.start = new Date(event.start.replace(/-/g, '\/'));
      event.end = new Date(event.end.replace(/-/g, '\/'));
    }
    event.type = type;

    console.log(event);

    setStatus((prev) => ({ ...prev, loading: true }));
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/users/calendar", event, {
        signal: controller.signal,
      });

      setStatus((prev) => ({ ...prev, loading: false }));
      if (type === 'goal') {
      dispatch({type: 'ADD_CALENDAR_EVENT', payload: response.data});
      }
      reset();
      handleModal();
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: err.message,
      }));
      console.log(err);

    }
    return () => {
      controller.abort();
    };
  };

  const goalForm = (
    type === 'goal' &&
    <>
      <Grid
        item
        xs={12}
        sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-evenly" }}
      >
        <TextField
          label="Start date"
          type="date"
          variant="outlined"
          name="start"
          id="start"
          defaultValue={currentDate}
          {...register("start", { required: 'Please pick a start date'  })}
          InputLabelProps={{ shrink: true, required: true }}
          error={errors?.start}
          helperText={errors.start ? errors.start.message : " "}
        />
        <TextField
          label="End date"
          type="date"
          variant="outlined"
          name="end"
          id="end"
          InputLabelProps={{ shrink: true, }}
          {...register("end", {  required: 'Please pick a completion date'  })}
          error={errors.end}
          helperText={errors.end ? errors.end.message : " "}
        />
      </Grid>
      <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
        <TextField
          label="Goal"
          type="text"
          name="title"
          id="title"
          fullWidth
          error={errors.title}
          {...register("title", { required: 'Please enter a goal' })}
          helperText={errors.title ? errors.title.message : " "}
        />
      </Grid>
    </>
  );

  const taskForm = (
    <>
      <div
        style={{
          marginTop: "1rem",
          mb: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Autocomplete
          options={state?.clients}
          fullWidth
          id="selectedClient"
          onChange={(e, value) => {
            setSelectedClient(value);
          }}
          getOptionLabel={(option) => option.firstname + " " + option.lastname}
          renderInput={(params) => <TextField {...params} label="Client" />}
        />{" "}
        <TextField
          label="Task Date"
          type="date"
          variant="outlined"
          name="taskDate"
          id="taskDate"
          onChange={(e, value) => {
            console.log(e, value);
          }}
          {...register("taskDate")}
          InputLabelProps={{ shrink: true, required: true }}
          error={errors.taskDate}
          helperText={errors.taskDate ? errors.taskDate.message : ""}
          sx={{}}
        />
        <TextField
          select
          label="Task Type"
          name="taskType"
          {...register("taskType")}
          id="taskType"
          defaultValue="cardio"
        >
          <MenuItem value="cardio">Cardio</MenuItem>
          <MenuItem value="workout">Workout</MenuItem>
        </TextField>
        <Autocomplete
          options={state?.customWorkouts}
          fullWidth
        
          id="task"
          onChange={(e, value) => {
            setSelectedTask(value);
          }}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Workouts" />}
        />{" "}
      </div>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleModal}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <Grid
        container
        spacing={1}
        gap={1}
        sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}
      >
        <Grid item xs={12}>
          {" "}
          <DialogTitle
            id="scroll-dialog-title"
            sx={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {state?.profile?.trainerId ? "Add a new goal" : "Add event"}
          </DialogTitle>
        </Grid>

        <DialogContent dividers>
          <form>
            {!state?.profile?.trainerId && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Event Type"
                  value={type}
                  {...register("type", { required: true })}
                  onChange={(e) => {
                    setType(e.target.value)
                
                  }}
                >
                  <MenuItem value='select'>Select a type of event</MenuItem>
                  <MenuItem value="goal">Goal</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                </TextField>
              </Grid>
            )}

            {type === "goal" && goalForm}
            {type === "task" && taskForm}
          </form>
        </DialogContent>
        <Grid item xs={12} align="center">
          {type !== 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={{ mt: 3, mb: 2 }}
            >
              {type === "goal" ? "Add Goal" : "Add Task"}
            </Button>
          )}
          <Button
            onClick={handleModal}
            variant="contained"
            sx={{ ml: 1, mt: 3, mb: 2 }}
            endIcon={<Close />}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    maxHeight: "90%",
    // minWidth: "250px",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    border: "2px solid #474a48",
    boxShadow: 24,
    p: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  spantitle: {
    fontWeight: "600",
    textDecoration: "underline",
  },
  tableTextLoad: {
    color: "red",
  },
  tableTextReps: {
    color: "blue",
  },
  tableColumns: {
    textDecoration: "underline",
  },
};

export default CalendarModal;
