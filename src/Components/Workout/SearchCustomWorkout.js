import { Clear, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Box,
  Popper,
  Paper,
  Typography,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { memo, useEffect, useState, useRef } from "react";
import useAxios from "../../hooks/useAxios";
import useProfile from "../../hooks/useProfile";
import ContinueWorkout from "./Modals/ContinueWorkout";

//functions needed to expand the cells of the data grid
function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const cellValue = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCell, setShowFullCell] = useState(false);
  const [showPopper, setShowPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
        setShowFullCell(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: "center",
        lineHeight: "24px",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: "100%",
          width,
          display: "block",
          position: "absolute",
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{
              minHeight: wrapper.current.offsetHeight - 3,
              backgroundColor: "grey",
              color: "white",
            }}
          >
            <Typography
              variant="body2"
              style={{ padding: 8, backgroundColor: "grey", color: "white" }}
            >
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}

const SearchCustomWorkout = ({ setStartWorkout, workoutType, tabValue }) => {
  const { state, dispatch } = useProfile();
  const [searchValue, setSearchValue] = useState([
    {
      columnField: "name",
      operatorValue: "contains",
      value: "",
    },
  ]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpenUnfinishedWorkout, setModalOpenUnFinishedWorkout] =
    useState(false);

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
    } else  if (state?.manageWorkout?.length > 0) {
      //if workout exists in state (its added by goal or overview screen) // auto load workout
      setStartWorkout(state.manageWorkout);
    
      //clear manageWorkout 
     

    } 
  }, []);


 
  // need to create autocomplete search for assigned workouts. only should be able to select one at a time!
  // once selected need to display a start button and change page to allow the workout reps and sets info to be entered and saved to api .

  const columns = tabValue === 1 ?[
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
  ]: [
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

  //get assignedCustomWorkouts
  const {
    loading,
    error,
    data: assignedCustomWorkouts,
  } = useAxios({
    url: `/custom-workout/client/assigned/${state.profile.clientId}`,
    method: "GET",
    type: "SET_ASSIGNED_CUSTOM_WORKOUTS",
  });


  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <ContinueWorkout
        setStartWorkout={setStartWorkout}
        modalOpenUnfinishedWorkout={modalOpenUnfinishedWorkout}
        setModalOpenUnFinishedWorkout={setModalOpenUnFinishedWorkout}
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
          ]}
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

      <Grid
        item
        sx={{
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          mb:4,
        }}
      >
        {selectionModel.length !== 0 && (
          <Button
            variant="contained"
            onClick={() => {
              setStartWorkout(
                workoutType.filter((w) => w._id === selectionModel[0])
              );
            }}
          >
            Start
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SearchCustomWorkout;
