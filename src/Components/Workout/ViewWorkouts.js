import { useMemo, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  
  Grid,
 
  Typography,

  Paper,
  CircularProgress,
  Button,

  useTheme,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";

import useMediaQuery from '@mui/material/useMediaQuery';

import NoWorkouts from "./NoWorkouts";
import ViewWorkoutModal from "./ViewWorkoutModal";

const ViewWorkouts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [open, setOpen] = useState(false);


  const [rowParams, setRowParams] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [viewWorkout, setViewWorkout] = useState([]);
  const theme = useTheme()
  const { state } = useProfile();
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const handleModal = () => setOpen((prev) => !prev);

  useEffect(() => {
    document.title = "Completed Workouts";
  }, []);



  // console.log(state.completedWorkouts)
  const columns = useMemo(
    () => [
      { field: "_id", hide: true },

      {
        field: "dateCompleted",
        headerName: "Date Completed",
        width: 120,
      },
      { field: "name", headerName: "Name", width: 120 },
     
     
        
      
    ],
    [state.completedWorkouts]
  );

 
 ///need to add notes and info to view modal 

  return (
    <Paper elevation={4} sx={{ borderRadius: 10, mt: 6, mb: 5, minWidth: '100%' }}>
      <Grid item sx={{ marginTop: 5 }}></Grid>

      <ViewWorkoutModal 
      
      open={open}
      viewWorkout={viewWorkout}
      handleModal={handleModal} />
       
      

      <Grid
        container
        spacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        mt={3}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography variant="h4" style={styles.title}>
            Completed Workouts
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ pr: 2, pl: 2, padding: 3 }}>
          {!state.completedWorkouts[0] && <NoWorkouts />}
          {error && <p>{error}</p>}
          {loading && <CircularProgress />}

          {state.completedWorkouts[0] && (
            <DataGrid
              rows={state.completedWorkouts}
              columns={columns}
              onSelectionModelChange={(selection) => {
                if (selection.length > 1) {
                  const selectionSet = new Set(selectionModel);
                  const result = selection.filter((s) => !selectionSet.has(s));

                  setSelectionModel(result);
                } else {
                  setSelectionModel(selection);
                }
              }}
              selectionModel={selectionModel}
              checkboxSelection={true}
              rowsPerPageOptions={[5, 10, 20, 50]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onCellEditCommit={(params) => setRowId(params.id)}
              onCellClick={(params) => setRowParams(params.row)}
              getRowId={(row) => row._id}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              autoHeight
              sx={{
                "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                  display: "none"
                },
                mt: 2, mb: 2 
              }}
            
              initialState={{
                sorting: {
                  sortModel: [{ field: "date", sort: "desc" }],
                },
              }}
            />
          )}
        </Grid>
        <Grid
          item
          sx={{
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
            mb: 4,
          }}
        >
          {selectionModel.length !== 0 && (
            <Button
              sx={{ borderRadius: "10px" }}
              variant="contained"
              onClick={() => {
                setViewWorkout(
                  state.completedWorkouts.filter(
                    (w) => w._id === selectionModel[0]
                  )
                );
                handleModal();
                
              }}
            >
              View
            </Button>
          )}
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
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #474a48",
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  span: {
    fontWeight: "600",
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
  title: {
    padding: "10px",
    border: "5px solid black",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    color: "white",

    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
  date: {
    padding: "5px",
    backgroundColor: "#3070af",
    color: "white",
    borderRadius: "10px",
  },
};

export default ViewWorkouts;
