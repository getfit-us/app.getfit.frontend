import { Add, Delete } from "@mui/icons-material";
import {
  Avatar,
  CircularProgress,
  Fab,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import AssignCustomWorkouts from "./AssignCustomWorkoutDialog";
import CreateWorkout from "./CreateWorkout";
import ViewWorkoutModal from "./ViewWorkoutModal";

const ManageCustomWorkouts = () => {
  const { state, dispatch } = useProfile();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [row, setRow] = useState();
  const [openViewWorkout, setOpenViewWorkout] = useState(false);
  const [viewWorkout, setViewWorkout] = useState([]);
  const navigate = useNavigate();
  const handleModal = () => setOpenViewWorkout((prev) => !prev);

  // component allows me to assign custom workouts  and view / edit workouts

  useEffect(() => {
    const getCustomWorkouts = async () => {
      const controller = new AbortController();
      setLoading(true);
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/${state.profile.clientId}`,
          {
            signal: controller.signal,
          }
        );
        dispatch({ type: "SET_CUSTOM_WORKOUTS", payload: response.data });
        setLoading(false);
        // reset();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          controller.abort();
          setLoading(false);
        };
      }
    };

    if (state.customWorkouts.length === 0) {
      getCustomWorkouts();
    }
    document.title ='Manage Custom Workouts';
  }, []);
  //api call
  const deleteCustomWorkout = async (id) => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await axiosPrivate.delete(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "DELETE_CUSTOM_WORKOUT", payload: response.data });
      setLoading(false);
      // reset();
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) {
        //     setSaveError((prev) => !prev);
        //     setTimeout(() => setSaveError((prev) => !prev), 5000);
        //   }
      }
      return () => {
        controller.abort();
        setLoading(false);
      };
    }
  };

  const columns = useMemo(
    () => [
      { field: "_id", hide: true },
      {
        field: "delete",
        headerName: "Delete",
        width: 60,
        height: 90,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <>
              <Fab
                aria-label="add"
                color="error"
                size="small"
                onClick={() => deleteCustomWorkout(params.row._id)}
              >
                <Delete />
                {loading && <CircularProgress />}
              </Fab>
            </>
          );
        },
      },
      { field: "name", headerName: "Workout Name", width: 200 },
      {
        field: "Created",
        headerName: "Date Created",
        width: 100,
        renderCell: (params) => {
          let date = params.row.Created.split("T");
          return (
            <>
              <span>{date[0]}</span>
            </>
          );
        },
      },
      {
        field: "assignedIds",
        headerName: "Assigned Clients",
        width: 300,
        type: "singleSelect",
        renderCell: (params) => {
          //if workout has assigned clients
          if (params.row.assignedIds.length > 0) {
            const intersection = [
              ...new Set(
                state.clients.filter((client) =>
                  params.row.assignedIds.includes(client._id)
                )
              ),
            ];
            return (
              <>
              <TextField sx={{mr:1}} fullWidth select defaultValue="1">
                <MenuItem value='1' sx={{textDecoration: 'underline'}}>Assigned Clients</MenuItem>
                {intersection.map((client) => {
                  return (
                    <MenuItem>
                      {client.firstname} {client.lastname}
                    </MenuItem>
                  );
                })}
              </TextField>
              <Fab
              size="small"
              onClick={(params) => {
                setOpenDialog((prev) => !prev);
              }}
            ><Add/></Fab></>
            );
          } else {
            return (
              <Fab
                size="small"
                onClick={(params) => {
                  setOpenDialog((prev) => !prev);
                }}
              ><Add/></Fab>
            );
          }
        },
      },

      {
        field: "view",
        headerName: "View",
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <>
              <Fab
                size="small"
                sx={{ border: "1px solid black", fontSize: 10 }}
                onClick={() => {
                  setViewWorkout([params.row]);
                  setOpenViewWorkout((prev) => !prev);
                }}
              >
                View
              </Fab>
            </>
          );
        },
      },
      { field: 'Edit', headerName: 'Edit', width: 70, sortable: false, editable: false, renderCell: (params) => { return (
        <>
        <Fab
          size="small"
          sx={{ border: "1px solid black", fontSize: 10 }}
          onClick={() => {
          dispatch({type: 'MANAGE_WORKOUT', payload: params.row.exercises});  
          navigate("/dashboard/create-workout");
          //set workout to state to manage       
          }}
        
        >
          Edit
        </Fab>
      </>
      )
      
      
      },}

    ],
    [state.customWorkouts]
  );

  //if no custom workouts in state
 console.log(state.managedWorkout)
  return (
    <Grid container style={{ marginTop: "2rem" }}>
      {state.customWorkouts && (
        <DataGrid
          disableSelectionOnClick={true}
          rows={state.customWorkouts}
          checkboxSelection={false}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          // onCellEditCommit={(params) => setRowId(params.id)}
          onCellClick={(params) => setRow(params.row)}
          getRowId={(row) => row._id}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          autoHeight
          sx={{ mt: 2, mb: 2 }}
        />
      )}
      <AssignCustomWorkouts
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        row={row}
      />
      <ViewWorkoutModal
        open={openViewWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleModal}
      />
      
    </Grid>
  );
};

export default ManageCustomWorkouts;
