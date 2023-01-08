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
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import ExerciseActions from "./ExerciseActions";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getAllExercises } from "../../Api/services";
import "./ManageExercise.css";

const ManageExercise = () => {
  const exercises = useWorkouts((state) => state.exercises);

  const delExercise = useWorkouts((state) => state.delExercise);
  const [rowId, setRowId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [loadingExercises, exercisesData, exercisesError] =
    useApiCallOnMount(getAllExercises);

  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen((prev) => !prev);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    document.title = "Manage Exercises";
  }, []);

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
    <Paper elevation={4} className="manageExercisePaper">
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
    </Paper>
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
