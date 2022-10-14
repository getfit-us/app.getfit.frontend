import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import useProfile from "../../hooks/useProfile";


import PropTypes from 'prop-types';

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
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: '100%',
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
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
            style={{ minHeight: wrapper.current.offsetHeight - 3 , backgroundColor: 'grey', color: 'white'}}
          >
            <Typography variant="body2" style={{ padding: 8 , backgroundColor: 'grey', color: 'white'}}>
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
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
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
}) => {
  const { state } = useProfile();
  const [searchValue, setSearchValue] = useState([
    {
      columnField: "name",
      operatorValue: "contains",
      value: "bigvaluetohidethedatagriddefaultoutput",
    },
  ]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(5);

  const columns = useMemo(
    () => [
      { field: "_id", hide: true },
      // { field: "picture", headerName: "Picture", width: 70 },
      {
        field: "name",
        headerName: "Exercise",
        editable: false,
        selectable: false,
        width: 250,
        renderCell: renderCellExpand
      },
      {
        field: "desc",
        headerName: "Description",
        editable: false,
        selectable: false,
        renderCell: renderCellExpand
      },
    ],
    [state.exercises.length]
  );

  return (
    <>
      <Grid item sx={{ mb: 10 }}>
        <Autocomplete
          id="exercise-list"
          freeSolo
          open={false}
          onInputChange={(e, value) => {
            if (value === "") {
              setSearchValue([
                {
                  columnField: "name",
                  operatorValue: "contains",
                  value: "bigvaluetohidethedatagriddefaultoutput",
                },
              ]);
            } else {
              setSearchValue([
                {
                  columnField: "name",
                  operatorValue: "contains",
                  value: value,
                },
              ]);
            }
          }}
          options={state.exercises.map((option) => option.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              label="Search"
            />
          )}
        />
        <DataGrid
          filterModel={{
            items: searchValue,
          }}
          onCellClick={(params) => {
            setCheckedExerciseList([...checkedExerciseList, params.row]);
          }}
          rows={state.exercises}
          checkboxSelection={true}
          disableColumnMenu={true}
          // hideFooter
          showCellRightBorder={false}
          disableSelectionOnClick
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
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
          }}
        />
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
                      exercise.numOfSets = [{ minutes: "", heartRate: "", level: '' }];
                    }
                  }
                );
              } else {
                checkedExerciseList.map((exercise) => {
                  if (exercise.type !== "cardio") {
                    exercise.numOfSets = [{ minutes: "", heartRate: "" , level: ''}];
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
