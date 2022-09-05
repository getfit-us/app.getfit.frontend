import { Autocomplete, Button, Grid, Paper, TextField } from "@mui/material";
import { DataGrid, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import useProfile from "../utils/useProfile";
const SearchExerciseTab = ({
  setCheckedExerciseList,
  checkedExerciseList,
  addExercise,
  setAddExercise,
  setRecentlyUsedExercises,
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
              <p>{params.row.name}</p>

              {/* <p >Description</p> */}
            </>
          );
        },
      },
    ],
    [state.exercises]
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
          renderInput={(params) => <TextField {...params} label="Search" />}
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
          hideFooter
          showCellRightBorder={false}
          disableSelectionOnClick
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          // pageSize={pageSize}
          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}

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
          }}
        />
        {checkedExerciseList.length !== 0 && (
          <Button
            variant="contained"
            onClick={() => {
              //add initial set so we get one set output on form
              checkedExerciseList.map(
                (exercise) => (exercise.numOfSets = [{ weight: "", reps: "" }])
              );

              setAddExercise((prev) => {
                //add each exercise to array
                checkedExerciseList.map((exercise) => {
                 
                  addExercise.push(exercise);
                  
                  
                });

               
                // need to remove duplicates ----
                const uniqueIds = new Set();
                // use a set (sets can not have duplicate items)
                const unique = addExercise.filter(element => {
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

export default SearchExerciseTab;