import { Close, SendRounded } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  Fade,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useWorkouts } from "../../Store/Store";

const AddExerciseModal = ({ open, handleModal, setOpen }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,

    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const axiosPrivate = useAxiosPrivate();

  const addExercise = useWorkouts((state) => state.addExercise);

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/exercises", data, {
        signal: controller.signal,
      });
      addExercise(response.data);
      reset();
      setOpen((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box>
          <form sx={{ mt: 1 }}>
            <Typography
              id="transition-modal-title"
              variant="h4"
              component="h2"
              xs={12}
            >
              New Exercise{" "}
            </Typography>

            <TextField
              {...register("type")}
              name="type"
              select
              label="Exercise Type"
              fullWidth
              defaultValue="push"
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="push">Push</MenuItem>
              <MenuItem value="pull">Pull</MenuItem>
              <MenuItem value="legs">Legs</MenuItem>
              <MenuItem value="core">Core</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
            </TextField>

            <TextField
              {...register("exerciseName", {
                required: "Please enter the name of the exercise",
              })}
              fullWidth
              placeholder="Exercise name"
              name="exerciseName"
              label="New Exercise Name"
              input
              sx={{ mt: 2 }}
              error={errors.exerciseName}
              helperText={
                errors.exerciseName ? errors.exerciseName.message : ""
              }
            />

            <TextField
              {...register("part")}
              name="part"
              label="Body Part"
              fullWidth
              defaultValue=""
              sx={{ mt: 2, mb: 2 }}
              select
            >
              <MenuItem value="chest">Chest</MenuItem>
              <MenuItem value="back">Back</MenuItem>
              <MenuItem value="shoulders">Shoulders</MenuItem>
              <MenuItem value="bicep">bicep</MenuItem>
              <MenuItem value="tricep">Tricep</MenuItem>
              <MenuItem value="legs">Legs</MenuItem>
              <MenuItem value="hamstring">hamstring</MenuItem>
              <MenuItem value="glute">Glute</MenuItem>
              <MenuItem value="calves">Calves</MenuItem>
              <MenuItem value="quad">Quads</MenuItem>

              <MenuItem value="core">Core</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
            </TextField>

            <TextField
              {...register("desc", {
                required: "Please enter the description of the exercise",
              })}
              multiline
              fullWidth
              minRows={3}
              placeholder="Description"
              name="desc"
              label="Exercise Description"
              input
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              color="secondary"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              endIcon={<SendRounded />}
              fullWidth
            >
              Add Exercise
            </Button>

            <Button
              onClick={handleModal}
              color="warning"
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              endIcon={<Close />}
              fullWidth
            >
              Close
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddExerciseModal;
