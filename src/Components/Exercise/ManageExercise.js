import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Fab,
  CircularProgress,
  Fade,
  Box,
  Modal,
  Backdrop,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, Close, SendRounded } from "@mui/icons-material";
import ExerciseActions from "./ExerciseActions";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getAllExercises } from "../../Api/services";

const ManageExercise = () => {
  const exercises = useWorkouts((state) => state.exercises);
  const addExercise = useWorkouts((state) => state.addExercise);
  const delExercise = useWorkouts((state) => state.delExercise);
  const [rowId, setRowId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [loadingExercises, exercisesData, exercisesError] =
    useApiCallOnMount(getAllExercises);

  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen((prev) => !prev);
  // const handleClose = () => setOpen(prev => !prev);
  const [error, setError] = useState();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    formState: { errors },
    handleSubmit,

    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    document.title = "Manage Exercises";
  }, []);

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

  const onDelete = async (data) => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/exercises/${data}`, {
        signal: controller.signal,
      });
      delExercise(data);
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const columns = useMemo(
    () => [
      { field: "_id", hide: true },
      {
        field: "dalete",
        headerName: "Delete",
        width: 70,
        height: 90,
        sortable: false,
        renderCell: (params) => {
          return (
            <>
              <Tooltip title="Delete">
                <Fab aria-label="add" color="error" size="small">
                  <DeleteIcon onClick={() => onDelete(params.row._id)} />
                </Fab>
              </Tooltip>
            </>
          );
        },
      },
      { field: "type", headerName: "Type", width: 120, editable: true },
      {
        field: "name",
        headerName: "Exercise Name",
        width: 250,
        editable: true,
      },
      { field: "desc", headerName: "Description", width: 200, editable: true },
      { field: "part", headerName: "Body Part", width: 150, editable: true },
      { field: "video", headerName: "Video", width: 150, editable: true },

      {
        field: "modify",
        headerName: "Modify",
        width: 70,
        renderCell: (params) => {
          return (
            <ExerciseActions
              rowId={rowId}
              params={params}
              setRowId={setRowId}
            />
          );
        },
      },
    ],
    [exercises, rowId]
  );

  return (
    <Grid
      container
      spacing={1}
      maxWidth="xl"
      mt={3}
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={4} style={styles.paper}>
        <Grid item>
          <h2 className="page-title">Manage Exercises</h2>
        </Grid>

        <Grid item xs={12}>
          {loadingExercises && exercises?.length === 0 ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={exercises}
              columns={columns}
              checkboxSelection={false}
              rowsPerPageOptions={[5, 10, 20, 50]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onCellEditCommit={(params) => setRowId(params.id)}
              getRowId={(row) => row._id}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              autoHeight
              sx={{ mt: 2, mb: 2 }}
            />
          )}
          <Grid item sx={{ margin: 2 }}>
            <Fab onClick={() => setOpen(true)}>
              <Add />
            </Fab>
          </Grid>
        </Grid>

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
            <Box sx={styles.modal}>
              <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                <Grid
                  container
                  spacing={1}
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Typography
                    id="transition-modal-title"
                    variant="h4"
                    component="h2"
                    xs={12}
                  >
                    New Exercise{" "}
                  </Typography>

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
                      <MenuItem value="core">Core</MenuItem>
                      <MenuItem value="cardio">Cardio</MenuItem>
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
                      helperText={
                        errors.exerciseName ? errors.exerciseName.message : ""
                      }
                    />
                  </Grid>

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

                  <Grid item xs={12}>
                    <TextField
                      {...register("desc", {
                        required:
                          "Please enter the description of the exercise",
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
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </Grid>
  );
};

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
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  paper: {
    borderRadius: "20px",
    marginTop: "5rem",
    marginBottom: "3rem",
    minWidth: "100%",
  },
  title: {
    padding: "10px",
    border: "5px solid black",
    borderRadius: "20px",
    backgroundColor: "#689ee1",

    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
};

export default ManageExercise;
