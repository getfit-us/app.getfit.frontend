import { Delete } from "@mui/icons-material";
import { CircularProgress, Fab, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import AssignCustomWorkouts from "./AssignCustomWorkoutDialog";

const ManageCustomWorkouts = () => {
  const { state, dispatch } = useProfile();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);

 ///// working on api call to update custom workout with assigned client id



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
  }, [state.customWorkouts]);
  //api call

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
                // onClick={() => onDelete(params.row._id)}
              >
                <Delete />
                {loading && <CircularProgress />}
              </Fab>
            </>
          );
        },
      },
      { field: "name", headerName: "Workout Name", width: 120 },
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
      { field: "assignedIds", headerName: "Assigned Clients", width: 300 ,  renderCell: (params) => {
          console.log(params.row.assignedIds);
        
        return (
          <Fab size="small" onClick={(params)=> {setOpenDialog(prev => !prev)}}></Fab>

          
        )
      },}
    ],
    [state.customWorkouts]
  );

  //if no custom workouts in state

  console.log(state.customWorkouts, state.clients);
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
          //   onCellEditCommit={(params) => setRowId(params.id)}
          getRowId={(row) => row._id}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          autoHeight
          sx={{ mt: 2, mb: 2 }}
        />
      )}
      <AssignCustomWorkouts setOpenDialog={setOpenDialog} openDialog={openDialog} />
    </Grid>
  );
};

export default ManageCustomWorkouts;
