import { Close, Star } from "@mui/icons-material";
import {
  Button,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const CalendarModal = ({ handleModal, open }) => {
  const [type, setType] = useState(0);
  const {state, dispatch} = useProfile()
   const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const onSubmit = async (event) => {

    event.id = state.profile.clientId;
   
    event.start = new Date(event.start).toLocaleDateString();
    event.end = new Date(event.end).toLocaleDateString();
    console.log(event);

    setStatus((prev) => ({ ...prev, loading: true }));
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/users/calendar", event, {
        signal: controller.signal,
      });

      setStatus((prev) => ({ ...prev, loading: false }));
      dispatch({type: 'ADD_CALENDAR_EVENT', payload: response.data});
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
          {...register("start", { required: true })}
          InputLabelProps={{ shrink: true, required: true }}
          error={errors.start}
          helperText={errors.start ? errors.start.message : ""}
        />
        <TextField
          label="End date"
          type="date"
          variant="outlined"
          name="end"
          id="end"
          InputLabelProps={{ shrink: true, required: true }}
          {...register("end", { required: true })}
          error={errors.end}
          helperText={errors.end ? errors.end.message : ""}
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
          {...register("title", { required: true })}
          helperText={errors.title ? errors.title.message : ""}
        />
      </Grid>
    </>
  );

  const taskForm = <></>;

  const reminderForm = <></>;

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
        spacing={0}
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
            Add New Event
          </DialogTitle>
        </Grid>

        <DialogContent dividers>
          <form>
            <Grid xs={12}>
              <TextField
                select
                fullWidth
                label="Event Type"
                value={type}
                {...register("type", { required: true })}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={0}>Select a type of event</MenuItem>
                <MenuItem value="goal">Goal</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="reminder">Reminder</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              {type === "goal"
                ? goalForm
                : type === "task"
                ? taskForm
                : type === "reminder"
                ? reminderForm
                : null}
            </Grid>
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
              Add Event
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
