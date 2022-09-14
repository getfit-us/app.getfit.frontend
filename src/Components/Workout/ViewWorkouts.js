import { useMemo, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  Box,
  Fab,
  Fade,
  Grid,
  Modal,
  Rating,
  Typography,
  Backdrop,
  Paper,
  CircularProgress,
  Button,
  Tooltip,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  useTheme,
} from "@mui/material";
import useProfile from "../../utils/useProfile";
import {
  CheckCircle,
  CheckCircleOutline,
  Close,
  Edit,
  Preview,
  Star,
} from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';

import NoWorkouts from "./NoWorkouts";

const ViewWorkouts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [rowParams, setRowParams] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [viewWorkout, setViewWorkout] = useState([]);
  const theme = useTheme()
  const { state } = useProfile();
  const handleModal = () => setOpen((prev) => !prev);
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  console.log(smUp);
  useEffect(() => {
    document.title = "View Workouts";
  }, []);

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  // console.log(state.completedWorkouts)
  const columns = useMemo(
    () => [
      { field: "_id", hide: true },

      {
        field: "dateCompleted",
        headerName: "Date Completed",
        width: 170,
      },
      { field: "name", headerName: "Name", width: 120 },
     
      {
        field: "rating",
        headerName: "Workout Rating",
        width: 130,
        hide: smUp ? false: true,
        renderCell: (params) => {
          return (
            <>
              <Rating
                name="hover-feedback"
                value={params.row.rating}
                precision={0.5}
                getLabelText={getLabelText}
                readOnly
                emptyIcon={
                  <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            </>
          );
        },
      },
    ],
    [state.completedWorkouts]
  );

 console.log(viewWorkout)
 ///need to add notes and info to view modal 

  return (
    <Paper elevation={4} sx={{ borderRadius: 10 }} maxWidth="xl">
      <Grid item sx={{ marginTop: 15 }}></Grid>

      
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
              <form sx={{ mt: 1 }}>
                <Grid
                  container
                  spacing={1}
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Typography
                    id="transition-modal-title"
                    variant="h5"
                    component="h4"
                    xs={12}
                    style={styles.date}
                  >
                    {viewWorkout[0]?.dateCompleted}
                  </Typography>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <span style={styles.tableColumns}>Exercise</span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={styles.tableColumns}>Set1</span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={styles.tableColumns}>Set2</span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={styles.tableColumns}>Set3</span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={styles.tableColumns}>Set4</span>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {viewWorkout[0]?.exercises?.map((exercise) => {
                        // console.log(Object.values(exercise)[0])
                        let sets = Object.values(exercise)[0];
                        console.log(sets[0].weight)

                        return (
                          <>
                          <TableRow
                            key={Object.keys(exercise)[0]}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <span style={styles.span}>
                                {" "}
                                {Object.keys(exercise)[0]}
                              </span>
                            </TableCell>
                            {sets.length > 0 && sets.map((set) => ({
                                return (
                                  <>
                                  <TableCell align="center">
                                    <span style={styles.span}>Weight: </span>
                                    <span style={styles.tableTextLoad}>
                                      {" "}
                                      {set.weight}{" "}
                                    </span>{" "}
                                    <span style={styles.span}>(lbs) Reps:</span>
                                    <span style={styles.tableTextReps}>
                                      {set.reps}
                                    </span>
                                  </TableCell>
                                 
                                

                                )
                                }))}
                            
                          
                                </>
                            
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <Button
                    onClick={handleModal}
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, bgcolor: "#689ee1" }}
                    endIcon={<Close />}
                    fullWidth
                  >
                    Close
                  </Button>
                </Grid>
              </form>
            </Box>
          </Fade>
        </Modal>
      

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
            Previous Workouts
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
              sx={{ mt: 2, mb: 2 }}
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
