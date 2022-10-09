import { Autocomplete, Button, Grid, Paper, TextField } from "@mui/material";
import { DataGrid, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import useProfile from "../../hooks/useProfile";
const SearchRecentlyUsed = ({
  setCheckedExerciseList,
  checkedExerciseList,
  addExercise,
  setAddExercise,
  setRecentlyUsedExercises,
  numOfSets
}) => {
  const { state } = useProfile();
  const [searchValue, setSearchValue] = useState([
   
  ]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(10);

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
        renderCell: (params) => {
          return (
            <>
              <div style={{ lineHeight: "normal", maxWidth: 350 }}>
                {" "}
                <p>{params.row.name}</p>
                
              </div>
            </>
          );
        },
      },
      {
        field: "desc",
        headerName: "Description", editable: false,
        selectable: false,
        width: 250}
    ],
    [state.usedExercises.length]
  );

 console.log(state.usedExercises);

  return (
    <>
      <Grid item sx={{ mb: 10 }}>
        <Autocomplete
          id="exercise-list"
          freeSolo
          open={false}
          onInputChange={(e, value) => {
          
              setSearchValue([
                {
                  columnField: "name",
                  operatorValue: "contains",
                  value: value,
                },
              ]);
            
          }}
          options={state.usedExercises.map((option) => option.name)}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
        <DataGrid
          filterModel={{
            items: searchValue,
          }}
          onCellClick={(params) => {
            setCheckedExerciseList([...checkedExerciseList, params.row]);
          }}
          rows={state.usedExercises}
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
              //add num of sets or use default of 1
              if (numOfSets !== 1) {
                let set = { weight: "", reps: "" };
                let tmpArr = [];
                for (let i = 0; i < numOfSets; i++) {
                  tmpArr = tmpArr.concat(set);
                }
                checkedExerciseList.map(
                  (exercise) => (exercise.numOfSets = tmpArr)
                );
              } else {
                checkedExerciseList.map(
                  (exercise) =>
                    (exercise.numOfSets = [{ weight: "", reps: "" }])
                );
              }

              /// *******  need to make another version of this function for use in startworkout
              setAddExercise((prev) => {
                //add each exercise to array
                checkedExerciseList.map((exercise) => {
                  addExercise.push(exercise);
                });

                // need to remove duplicates ----
                const uniqueIds = new Set();
                // use a set (sets can not have duplicate items)
                const unique = addExercise.filter((element) => {
                  const isDuplicate = uniqueIds.has(element._id);

                  uniqueIds.add(element._id);

                  if (!isDuplicate) {
                    return true;
                  }

                  return false;
                });

                return unique;
              });

              setRecentlyUsedExercises((prev) => {
                //copy prev array add new exercises
                const update = prev;
                addExercise.map((exercise) => update.push(exercise));
                return update;
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

export default SearchRecentlyUsed;
