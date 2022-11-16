import { Clear, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useWorkouts } from "../../Store/Store";
import { getAllExercises } from "../../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
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
          style={{ width }}
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

const SearchExerciseTab = ({
  setCheckedExerciseList,
  checkedExerciseList,
  addExercise,
  setAddExercise,
  setRecentlyUsedExercises,
  numOfSets,
  inStartWorkout,
  selectionModel,
  setSelectionModel,
}) => {
  const [searchValue, setSearchValue] = useState([
    {
      columnField: "name",
      operatorValue: "contains",
      value: "",
    },
  ]);
  const [pageSize, setPageSize] = useState(5);
  const exercises = useWorkouts((state) => state.exercises);
  const [loadingExercises, newExercises, errorExercises] =
  useApiCallOnMount(getAllExercises);

  const columns = useMemo(
    () => [
      { field: "_id", hide: true },
      // { field: "picture", headerName: "Picture", width: 70 },
      {
        field: "name",
        headerName: "Exercise",
        editable: false,
        selectable: false,
        flex: 2,
        renderCell: renderCellExpand,
      },
      {
        field: "desc",
        headerName: "Description",
        editable: false,
        selectable: false,
        flex: 0.8,
        renderCell: renderCellExpand,
      },
    ],
    [exercises.length]
  );

  useEffect(() => {
    if (selectionModel?.length !== checkedExerciseList?.length)
      setCheckedExerciseList(
        exercises.filter((exercise) => selectionModel.includes(exercise._id))
      );
  }, [selectionModel, checkedExerciseList?.length]);

  return (
    <>
      <Grid item sx={{ mb: 10 }}>
        <Autocomplete
          size="small"
          sx={{ mt: 1 }}
          id="exercise-list"
          freeSolo
          open={false}
          value={searchValue[0].value}
          onInputChange={(e, value) => {
            setSearchValue([
              {
                columnField: "name",
                operatorValue: "contains",
                value: value,
              },
            ]);
          }}
          options={exercises.map((option) => option.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
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
        />
        {(loadingExercises && exercises.length === 0)  ? ( <CircularProgress/> ) : ( <DataGrid
          filterModel={{
            items: searchValue,
          }}
          onCellClick={(params) => {
            //check if id exists in selection model
          }}
          rows={exercises}
          checkboxSelection={true}
          disableColumnMenu={true}
          // hideFooter
          showCellRightBorder={false}
          disableSelectionOnClick={true}
          selectionModel={selectionModel}
          onSelectionModelChange={(selection) => {
            //  setSelectionModel((prev) => {

            //   const _prev = prev.concat(selection)

            //   const unique = _prev.filter((v, i, a) => a.indexOf(v) === i);
            //   return unique;
            //  })

            setSelectionModel(selection);
          }}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowHeight={100}
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
            "&.MuiDataGrid-root .MuiDataGrid-cell": {
              whiteSpace: "normal !important",
              wordWrap: "break-word !important",
            },
            fontWeight: "bold",
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />)}
       
        {checkedExerciseList.length !== 0 && (
          <Button
            variant="contained"
            onClick={() => {
              //add initial set so we get one set output on form

              if (numOfSets !== 1) {
                let set = { weight: "", reps: "" };
                let tmpArr = [];
                for (let i = 0; i < numOfSets; i++) {
                  tmpArr = tmpArr.concat(set);
                }
                checkedExerciseList.map(
                  //set sets to number of sets selected
                  (exercise) => {
                    if (exercise.type !== "cardio") {
                      exercise.numOfSets = tmpArr;
                    } else if (exercise.type === "cardio") {
                      exercise.numOfSets = [
                        { minutes: "", heartRate: "", level: "" },
                      ];
                    }
                  }
                );
              } else {
                checkedExerciseList.map((exercise) => {
                  if (exercise.type !== "cardio") {
                    exercise.numOfSets = [
                      { minutes: "", heartRate: "", level: "" },
                    ];
                  } else exercise.numOfSets = [{ weight: "", reps: "" }];
                });
              }

              /// if being using from start workout component then we alter the method of adding the exercises
              setAddExercise((prev) => {
                // if component is being used from START WORKOUT instead of Create Workout
                if (inStartWorkout) {
                  //use localStorage instead of state ----
                  // const updated = [...prev];
                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );
                  checkedExerciseList.map((exercise) => {
                    updated[0].exercises.push(exercise);
                  });
                  const uniqueIds = new Set();
                  // use a set (sets can not have duplicate items)
                  const unique = updated[0].exercises.filter((exercise) => {
                    const isDuplicate = uniqueIds.has(exercise._id);

                    uniqueIds.add(exercise._id);

                    if (!isDuplicate || Array.isArray(exercise)) {
                      return true;
                    }

                    return false;
                  });

                  setCheckedExerciseList([]);
                  setSelectionModel([]);
                  updated[0].exercises = unique;
                  // save to localstorage also
                  localStorage.setItem("startWorkout", JSON.stringify(updated));
                  return updated;
                } else {
                  //load from localstorage instead of state
                  const updated = JSON.parse(
                    localStorage.getItem("NewWorkout")
                  );
                  checkedExerciseList.map((exercise) => {
                    updated.push(exercise);
                  });
                  //add each exercise to array

                  // need to remove duplicates ----
                  const uniqueIds = new Set();
                  // use a set (sets can not have duplicate items)
                  const unique = updated.filter((element) => {
                    const isDuplicate = uniqueIds.has(element._id);

                    uniqueIds.add(element._id);

                    if (!isDuplicate || Array.isArray(element)) {
                      return true;
                    }

                    return false;
                  });
                  localStorage.setItem("NewWorkout", JSON.stringify(unique));
                  return unique;
                }
              });

              //reset checkbox selection
              setCheckedExerciseList([]);
              setSelectionModel([]);
            }}
          >
            {checkedExerciseList.length > 1
              ? "Add Exercises to Workout"
              : "Add Exercise to Workout"}
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SearchExerciseTab;
