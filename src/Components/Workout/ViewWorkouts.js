import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Button,
  useTheme,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";

import useMediaQuery from "@mui/material/useMediaQuery";

import NoWorkouts from "./NoWorkouts";
import ViewWorkoutModal from "./ViewWorkoutModal";
import useAxios from "../../hooks/useAxios";
import { axiosPrivate } from "../../hooks/axios";
import ca from "date-fns/esm/locale/ca/index.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewWorkouts = () => {
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const [rowParams, setRowParams] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [viewWorkout, setViewWorkout] = useState([]);
  const theme = useTheme();
  const { state, dispatch } = useProfile();
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const handleModal = () => setOpen((prev) => !prev);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //api calls
  const controller = new AbortController();

  //get assignedCustomWorkouts
  const {
    loading,
    error,
    data: assignedWorkouts,
  } = useAxios(
    {
      method: "get",
      url: `/custom-workout/client/assigned/${state.profile.clientId}`,

      signal: controller.signal,
    },
    controller,
    "SET_ASSIGNED_CUSTOM_WORKOUTS"
  );
  //get Custom Created workouts
  const {
    loading: loading2,
    error: error2,
    data: customWorkouts,
  } = useAxios(
    {
      method: "get",
      url: `/custom-workout/client/${state.profile.clientId}`,

      signal: controller.signal,
    },
    controller,
    "SET_CUSTOM_WORKOUTS"
  );

  
  const onDelete = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/custom-workout/${id}`, {
        signal: controller.signal,
      })
      dispatch({
        type: "DELETE_CUSTOM_WORKOUT", payload: response.data});
    } catch (err) {
      console.log(err);

    }
    return () => {
      controller.abort();
    };

  }
  
  useEffect(() => {
    document.title = "View Workouts";

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
  const columnsAssigned = useMemo(
    () => [
      { field: "_id", hide: true },

      { field: "name", headerName: "Name", width: 200 },
      {
        field: "Created",
        headerName: "Date Created",
        width: 100,
        renderCell: (params) => {
          let date = new Date(params.row.Created);

          return date.toLocaleDateString();
        },
      },
    ],
    [state.customWorkouts, state.assignedCustomWorkouts]
  );
  ///need to add notes and info to view modal

  console.log(state.customWorkouts, state.completedWorkouts);
  return (
    <Paper
      elevation={4}
      sx={{ borderRadius: 10, mt: 6, mb: 5, minWidth: "100%", p: "5px" }}
    >
      <Grid item sx={{ marginTop: 5 }}></Grid>

      <ViewWorkoutModal
        open={open}
        viewWorkout={viewWorkout}
        handleModal={handleModal}
      />

      <Grid
        container
        spacing={1}
        mt={3}
        display="flex"
        justifyContent="center"
        minWidth="100%"
      >
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
          >
            <Tab label="Completed Workouts" {...a11yProps(0)} />
            <Tab label="Assigned Workouts" {...a11yProps(1)} />
            <Tab label="Created Workouts" {...a11yProps(2)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {/* Completed Workouts */}

          <TabPanel value={value} index={0}>
            <h2 className="page-title">Completed Workouts</h2>

            {/* {!state.completedWorkouts[0] && <NoWorkouts />} */}
            {error && <p>{error}</p>}
            {loading && loading2 && <CircularProgress />}

            {state.completedWorkouts[0] && (
              <DataGrid
                rows={state.completedWorkouts}
                columns={columns}
                onSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(selectionModel);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );

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
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                  mt: 2,
                  mb: 2,
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                  },
                }}
              />
            )}
            <Grid
              item
              sx={{
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
                mb: 4,
              }}
            >
              {selectionModel.length !== 0 ? (
                <Button
                  sx={{ borderRadius: "10px", mb: 1 }}
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
              ) : (
                <Grid item sx={{ mb: 10 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          {/* Assigned Workouts */}
          <TabPanel value={value} index={1}>
            <h2 className="page-title">Assigned Workouts</h2>
            {error && <p>{error}</p>}
            {loading && <CircularProgress />}

            {state.assignedCustomWorkouts[0] && (
              <DataGrid
                rows={state.assignedCustomWorkouts}
                columns={columnsAssigned}
                onSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(selectionModel);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );

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
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                  mt: 2,
                  mb: 2,
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                  },
                }}
              />
            )}
            <Grid
              item
              sx={{
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
                mb: 4,
              }}
            >
              {selectionModel.length !== 0 ? (
                <Button
                  sx={{ borderRadius: "10px", mb: 1 }}
                  variant="contained"
                  onClick={() => {
                    setViewWorkout(
                      state.assignedCustomWorkouts.filter(
                        (w) => w._id === selectionModel[0]
                      )
                    );
                    handleModal();
                  }}
                >
                  View
                </Button>
              ) : (
                <Grid item sx={{ mb: 10 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={2}>
            {/* Created Workouts */}
            <h2 className="page-title">Created Workouts</h2>

            {error && <p>{error}</p>}
            {loading && <CircularProgress />}

            {state.customWorkouts[0] && (
              <DataGrid
                rows={state.customWorkouts}
                columns={columnsAssigned}
                onSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(selectionModel);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );

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
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                  mt: 2,
                  mb: 2,
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                  },
                }}
              />
            )}
            <Grid
              item
              sx={{
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
                mb: 4,
              }}
            >
              {selectionModel.length !== 0 ? (
                <>
                  <Button
                    sx={{ borderRadius: "10px", mb: 1 }}
                    variant="contained"
                    onClick={() => {
                      setViewWorkout(
                        state.customWorkouts.filter(
                          (w) => w._id === selectionModel[0]
                        )
                      );
                      handleModal();
                    }}
                  >
                    View
                  </Button>
                  <Button
                    sx={{ borderRadius: "10px", mb: 1 ,ml: 1 }}
                    variant="contained"
                    onClick={() => {
                     onDelete(selectionModel[0]);
                     setSelectionModel([]);
                    
                    }}
                    color='error'
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Grid item sx={{ mb: 10 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </TabPanel>
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
    padding: "4px",
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
