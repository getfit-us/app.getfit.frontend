import { SendRounded } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useProfile from "../../hooks/useProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";

const CreateExercise = () => {
  const { state, dispatch } = useProfile();
  const [apiError, setApiError] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    reset,
    control,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/exercises", data, {
        signal: controller.signal,
      });
      dispatch({ type: "ADD_EXERCISE", payload: response.data });

      reset();
      setApiError(null);
    } catch (err) {
      console.log(err);
      setApiError(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Grid
        container
        spacing={1}
        sx={{ justifyContent: "center", alignItems: "center" , }}
      >
        {apiError != null ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
             <strong>{apiError.response.status === 409 ? `Exercise Already Exists` : ""}</strong>
          </Alert>
        ) : (
          <Typography
            id="transition-modal-title"
            variant="h4"
            component="h2"
            xs={12}
          >
            Create Exercise{" "}
          </Typography>
        )}

        <Grid item xs={12} sm={12} lg={12} mt={5}>
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
          </TextField>
        </Grid>

        <Grid item xs={12}>
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
            helperText={errors.exerciseName ? errors.exerciseName.message : ""}
          />
        
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            endIcon={<SendRounded />}
          >
            Add Exercise
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateExercise;
