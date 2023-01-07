import { Clear, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Grid,
  InputAdornment,
  TextField,
  IconButton,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useWorkouts } from "../../Store/Store";
import ContinueWorkout from "./Modals/ContinueWorkout";
import renderCellExpand from "./CellExpander";
import ViewWorkoutModal from "./Modals/ViewWorkoutModal";

const SearchCustomWorkout = ({ setStartWorkout, workoutType, tabValue }) => {
  const manageWorkout = useWorkouts((state) => state.manageWorkout);
  const [viewWorkout, setViewWorkout] = useState({});
  const [openViewWorkout, setOpenViewWorkout] = useState(false);

  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    message: "",
  });

  const [modalOpenUnfinishedWorkout, setModalOpenUnFinishedWorkout] =
    useState(false);

  const [searchValue, setSearchValue] = useState([
    {
      columnField: "name",
      operatorValue: "contains",
      value: "",
    },
  ]);

  const handleModal = () => setOpenViewWorkout((prev) => !prev);

  const convertDate = (params) => {
    return params.row?.dateCompleted
      ? new Date(params.row.dateCompleted)
      : new Date(params.row.Created);
  };

  //use effect to check for unfinished workout
  useEffect(() => {
    // if unfinishedworkout is found open modal and ask the user if they want to continue or start a new workout
    if (localStorage.getItem("startWorkout")) {
      // open modal
      setModalOpenUnFinishedWorkout(true);
    } else if (manageWorkout?.name) {
      //if workout exists in state (its added by goal or overview screen) // auto load workout
      setStartWorkout([manageWorkout]);
      localStorage.setItem("startWorkout", JSON.stringify([manageWorkout]));

      //clear manageWorkout
    }
  }, [manageWorkout, setStartWorkout]);

  // need to create autocomplete search for assigned workouts. only should be able to select one at a time!
  // once selected need to display a start button and change page to allow the workout reps and sets info to be entered and saved to api .

  const columns =
    tabValue === 1
      ? [
          { field: "_id", hide: true },

          { field: "name", headerName: "Name", flex: 1.1 },
          {
            field: "Created",
            type: "dateTime",
            headerName: "Date Created",
            flex: 1,
            valueGetter: convertDate,
            renderCell: (params) => {
              return (
                <div>
                  {params.row.Created &&
                    new Date(params.row.Created).toDateString()}
                </div>
              );
            },
          },
        ]
      : [
          { field: "_id", hide: true },
          {
            field: "name",
            headerName: "Workout",
            editable: false,
            selectable: false,
            flex: 1.1,
            renderCell: renderCellExpand,
          },
          {
            field: "dateCompleted",
            headerName: "Date Completed",
            flex: 1,
            type: "dateTime",
            valueGetter: convertDate,

            sortable: true,
            renderCell: (params) => {
              return (
                <div>
                  {params.row.dateCompleted &&
                    new Date(params.row.dateCompleted).toDateString()}
                </div>
              );
            },
          },
        ];

  return (
    <>
      <ContinueWorkout
        setStartWorkout={setStartWorkout}
        modalOpenUnfinishedWorkout={modalOpenUnfinishedWorkout}
        setModalOpenUnFinishedWorkout={setModalOpenUnFinishedWorkout}
      />
      <ViewWorkoutModal
        open={openViewWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleModal}
      />
      <Autocomplete
        id="workout-list"
        freeSolo
        open={false}
        autoComplete
        value={searchValue[0].value}
        size="small"
        clearIcon={<Clear />}
        onInputChange={(e, value) => {
          setSearchValue([
            {
              columnField: "name",
              operatorValue: "contains",
              value: value,
            },
          ]);
        }}
        options={workoutType.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear"
                      onClick={() => {
                        setSearchValue([
                          {
                            columnField: "name",
                            operatorValue: "contains",
                            value: "",
                          },
                        ]);
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
            label="Search"
          />
        )}
        sx={{ mt: 1 }}
      />
      {status.loading && workoutType?.length === 0 ? (
        <LinearProgress />
      ) : (
        <DataGrid
          filterModel={{
            items: searchValue,
          }}
          initialState={{
            sorting: {
              sortModel: [
                tabValue === 2
                  ? { field: "dateCompleted", sort: "desc" }
                  : { field: "Created", sort: "desc" },
              ],
            },
          }}
          //disable multiple box selection
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
          rows={workoutType}
          checkboxSelection={true}
          disableColumnMenu={true}
          // hideFooter
          showCellRightBorder={false}
          disableSelectionOnClick={false}
          // selectionModel={selectionModel}
          // onSelectionModelChange={setSelectionModel}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          getRowId={(row) => row._id}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          autoHeight
          sx={{
            mt: 2,
            mb: 5,
            "& .MuiDataGrid-columnHeaders": { display: "none" },
            "& .MuiDataGrid-virtualScroller": { marginTop: "0!important" },
            fontWeight: "bold",
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
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
        {selectionModel.length !== 0 && (
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignContent: "center",
            textAlign: "center",
          }}>
            <Button
              variant="contained"
              color='success'
              onClick={() => {
                setStartWorkout(
                  workoutType.filter((w) => w._id === selectionModel[0])
                );
              }}
            >
              Start
            </Button>

            <Button
              variant="contained"
              color='info'
              onClick={() => {
                setViewWorkout(
                  workoutType.filter((w) => w._id === selectionModel[0])
                );
                handleModal();
              }}
            >
              View
            </Button>
          </div>
        )}
      </Grid>
    </>
  );
};

export default SearchCustomWorkout;
