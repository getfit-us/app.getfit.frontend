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
import AssignCustomWorkouts from "./AssignCustomWorkoutDialog";
import ViewWorkoutModal from "../Workout/Modals/ViewWorkoutModal";
import { useProfile, useWorkouts } from "../../Store/Store";

const ManageCustomWorkouts = () => {
  const profile = useProfile((state) => state.profile);
  const clients = useProfile((state) => state.clients);
  const customWorkouts = useWorkouts((state) => state.customWorkouts);
  const setCustomWorkouts = useWorkouts((state) => state.setCustomWorkouts);
  const delCustomWorkout = useWorkouts((state) => state.delCustomWorkout);
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [row, setRow] = useState();
  const [openViewWorkout, setOpenViewWorkout] = useState(false);
  const [viewWorkout, setViewWorkout] = useState([]);
  const navigate = useNavigate();
  const handleModal = () => setOpenViewWorkout((prev) => !prev);

  const convertDate = (params) => {
    return params.row?.dateCompleted
      ? new Date(params.row.dateCompleted)
      : new Date(params.row.Created);
  };

  // component allows me to assign custom workouts  and view / edit workouts

  useEffect(() => {
    const getCustomWorkouts = async () => {
      const controller = new AbortController();
      setLoading(true);
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/${profile.clientId}`,
          {
            signal: controller.signal,
          }
        );
        setCustomWorkouts(response.data);
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

    if (customWorkouts.length === 0) {
      getCustomWorkouts();
    }
    document.title = "Manage Custom Workouts";
  }, []);
  //api call
  const deleteCustomWorkout = async (id) => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await axiosPrivate.delete(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      delCustomWorkout(response.data);
      setLoading(false);
      // reset();
    } catch (err) {
      console.log(err);

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
        width: 200,
        valueGetter: convertDate,

        renderCell: (params) => {
          let date = params.row.Created.split("T");
          return (
            <div>
            {params.row.Created &&
              new Date(params.row.Created).toDateString()}
          </div>
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
                clients.filter((client) =>
                  params.row.assignedIds.includes(client._id)
                )
              ),
            ];
            return (
              <>
                <TextField sx={{ mr: 1 }} fullWidth select defaultValue="1">
                  <MenuItem value="1" sx={{ textDecoration: "underline" }}>
                    Assigned Clients
                  </MenuItem>
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
                >
                  <Add />
                </Fab>
              </>
            );
          } else {
            return (
              <Fab
                size="small"
                onClick={(params) => {
                  setOpenDialog((prev) => !prev);
                }}
              >
                <Add />
              </Fab>
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
      {
        field: "Edit",
        headerName: "Edit",
        width: 70,
        sortable: false,
        editable: false,
        renderCell: (params) => {
          return (
            <>
              <Fab
                size="small"
                sx={{ border: "1px solid black", fontSize: 10 }}
                onClick={() => {
                  setManageWorkout(params.row);
                  navigate("/dashboard/create-workout");
                  //set workout to state to manage
                }}
              >
                Edit
              </Fab>
            </>
          );
        },
      },
    ],
    [customWorkouts.length]
  );

  //if no custom workouts in state
  return (
    <Grid container style={{ marginTop: "2rem" }}>
      {customWorkouts && (
        <DataGrid
        initialState={{
          sortModel: [
            {field: 'Created', sort: 'desc'},
          ],
        }}
          disableSelectionOnClick={true}
          rows={customWorkouts}
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
