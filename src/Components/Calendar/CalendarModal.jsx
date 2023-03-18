import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile, useWorkouts } from "../../Store/Store";
import ViewWorkoutModal from "../Workout/Modals/ViewWorkoutModal";
import useSWR from "swr";
import { getSWR } from "../../Api/services";

import "./CalendarModal.css";

const CalendarModal = ({ handleModal, open, currentDate }) => {
  const profile = useProfile((state) => state.profile);
  const isAdmin = useProfile((state) => state.isAdmin);
  const isTrainer = useProfile((state) => state.isTrainer);
  const isClient = useProfile((state) => state.isClient);
  const setClients = useProfile((state) => state.setClients);
  const addCalendarEvent = useProfile((state) => state.addCalendarEvent);
  const setCustomWorkouts = useWorkouts((state) => state.setCustomWorkouts);
  const [type, setType] = useState("select");
  const [selectedClient, setSelectedClient] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const handleViewWorkout = () => setOpenViewModal((prev) => !prev);
  const axiosPrivate = useAxiosPrivate();

  const { data: customWorkouts, isLoading } = useSWR(
    `custom-workout/client/${profile?.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: [],
      onSucess: (data) => {
        setCustomWorkouts(data);
      },
    }
  );

  const { data: clients, isLoading: isLoadingClients } = useSWR(isTrainer || isAdmin ? 
    `/clients/all/${profile.clientId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: [{
        firstname: "Loading",
        lastname: "Loading",
      }],
      onSuccess: (data) => {
        setClients(data);
      },
    }
  );

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    message: "",
    success: false,
  });

  const [errors, setErrors] = useState({
    start: {
      error: false,
      message: "Start date is required",
    },
    end: {
      error: false,
      message: "End date is required",
    },

    title: {
      error: false,
      message: "Title is required",
    },
  });

  const [inputs, setInputs] = useState({
    start: "",
    end: "",
    title: "",
    taskDate: "",
    taskType: "cardio",
  });

  useEffect(() => {
    if (profile?.roles?.includes(2)) {
      setType("goal");
    }
  }, [type, profile]);

  const validateForm = (type) => {
    if (type === "goal") {
      if (!inputs.start) {
        setErrors((prev) => ({
          ...prev,
          start: {
            error: true,
            message: "Start date is required",
          },
        }));
      }
      if (!inputs.end) {
        setErrors((prev) => ({
          ...prev,
          end: {
            error: true,
            message: "End date is required",
          },
        }));
      } else if (
        new Date(inputs.start).getTime() > new Date(inputs.end).getTime()
      ) {
        setErrors((prev) => ({
          ...prev,
          end: {
            error: true,
            message: "End date must be after start date",
          },
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          end: {
            error: false,
            message: "",
          },
        }));
      }

      if (!inputs.title) {
        setErrors((prev) => ({ ...prev, title: { error: true, message: "" } }));
      }
    } else {
      //form is for a task
    }
  };

  const onSubmit = async () => {
    //check date validation end date is after start date

    let event = {
      start: inputs.start,
      end: inputs.end,
      title: inputs.title,
    };

    if (type === "task") {
      event.id = selectedClient._id;
      if (selectedTask?.exercises[0]?.type === "cardio") {
        event.title = `Cardio: ${selectedTask.name}`;
      } else {
        event.title = `Workout: ${selectedTask.name}`;
      }

      event.activityId = selectedTask._id;
      event.end = new Date(inputs.taskDate.replace(/-/g, "/"));
    } else {
      event.id = profile.clientId;

      event.start = new Date(inputs.start.replace(/-/g, "/"));
      event.end = new Date(inputs.end.replace(/-/g, "/"));
    }
    event.type = type;

    setStatus((prev) => ({ ...prev, loading: true }));
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/users/calendar", event, {
        signal: controller.signal,
      });

      setStatus((prev) => ({ ...prev, loading: false, success: true }));
      if (type === "goal") {
        // We need to add the event to local state
        addCalendarEvent(response.data);
        handleModal();
        // clear form
        setInputs({
          start: currentDate,
          end: currentDate,
          title: "",
          taskDate: currentDate,
          taskType: "cardio",
        });
      }
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: err.message,
      }));
      console.log(err);
    }
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        success: false,
        error: false,
        message: "",
      }));
    }, 3000);

    return () => {
      controller.abort();
    };
  };

  const goalForm = (
    <>
      <TextField
        label="Start date"
        type="date"
        variant="outlined"
        name="start"
        id="start"
        size="small"
        value={inputs.start}
        onChange={(e) => setInputs({ ...inputs, start: e.target.value })}
        onBlur={() => validateForm("goal")}
        InputLabelProps={{ shrink: true, required: true }}
        error={errors?.start?.error}
        helperText={errors.start.error ? errors.start.message : " "}
        className="goal-input"
      />

      <TextField
        label="End date"
        type="date"
        variant="outlined"
        name="end"
        id="end"
        size="small"
        onBlur={() => validateForm("goal")}
        value={inputs.end}
        onChange={(e) => setInputs({ ...inputs, end: e.target.value })}
        className="goal-input"
        InputLabelProps={{ shrink: true }}
        error={errors.end.error}
        helperText={errors.end.error ? errors.end.message : " "}
      />

      <TextField
        label="Goal"
        type="text"
        name="title"
        value={inputs.title}
        onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
        id="title"
        className="goal-input"
        onBlur={() => validateForm("goal")}
        size="small"
        fullWidth
        multiline
        rows={4}
        error={errors.title.error}
        helperText={errors.title.error ? errors.title.message : " "}
        sx={{ width: "100%" }}
      />
    </>
  );

  const taskForm = (
    <>
      <Autocomplete
        options={clients}
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
        value={inputs.taskDate}
        onChange={(e) => setInputs({ ...inputs, taskDate: e.target.value })}
        onBlur={() => validateForm("task")}
        InputLabelProps={{ shrink: true, required: true }}
        error={errors.taskDate}
        helperText={errors.taskDate ? errors.taskDate.message : ""}
      />
      <TextField
        select
        label="Task Type"
        name="taskType"
        id="taskType"
        fullWidth
        value={inputs.taskType}
        onChange={(e) => setInputs({ ...inputs, taskType: e.target.value })}
      >
        <MenuItem value="cardio">Cardio</MenuItem>
        <MenuItem value="workout">Workout</MenuItem>
      </TextField>
      <Autocomplete
        options={customWorkouts}
        fullWidth
        id="task"
        onChange={(e, value) => {
          setSelectedTask(value);
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Workouts" />}
      />{" "}
      {selectedTask?._id && (
        <Button variant="contained" onClick={handleViewWorkout}>
          View Workout
        </Button>
      )}
      <TextField
        label="Notes"
        name="notes"
        value={inputs.notes}
        multiline
        rows={4}
        onChange={(e) => setInputs({ ...inputs, notes: e.target.value })}
      />
    </>
  );

  return (
    <>
      <ViewWorkoutModal
        open={openViewModal}
        viewWorkout={[selectedTask]}
        handleModal={handleViewWorkout}
      />
      <Dialog
        open={open}
        onClose={handleModal}
        scroll="paper"
        aria-labelledby="calendar-dialog-title"
        aria-describedby="calendar-add-event"
      >
        {" "}
        <DialogTitle
          id="scroll-dialog-title"
          sx={{
            textAlign: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            backgroundColor: "#34adff",
            backgroundImage:
              "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
          }}
        >
          {profile?.trainerId ? "Create Goal" : "Add event"}
        </DialogTitle>
        <DialogContent dividers className="goalDialogContent">
          {(profile?.roles?.includes(5) || profile?.roles?.includes(10)) && (
            <TextField
              select
              fullWidth
              label="Event Type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <MenuItem value="select">Select a type of event</MenuItem>
              <MenuItem value="goal">Goal</MenuItem>
              <MenuItem value="task">Task</MenuItem>
            </TextField>
          )}

          {isLoading && customWorkouts?.length === 0 ? (
            <Skeleton variant="rectangular" height={100} animation="wave" />
          ) : type === "goal" ? (
            goalForm
          ) : (
            taskForm
          )}
        </DialogContent>
        <Grid
          item
          xs={12}
          align="center"
          sx={{
            backgroundColor: "#34adff",
            backgroundImage:
              "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
          }}
        >
          {type !== 0 && (
            <Button
              variant="contained"
              color={status.success ? "success" : "primary"}
              onClick={onSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {status.success
                ? "Added Task!"
                : type === "goal"
                ? "Add Goal"
                : "Add Task"}
            </Button>
          )}
          <Button
            onClick={handleModal}
            variant="contained"
            color="warning"
            sx={{ ml: 1, mt: 3, mb: 2 }}
            endIcon={<Close />}
          >
            Close
          </Button>
        </Grid>
      </Dialog>
    </>
  );
};

const styles = {
  dialog: {
    backgroundImage:
      "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
  },
};

export default CalendarModal;
