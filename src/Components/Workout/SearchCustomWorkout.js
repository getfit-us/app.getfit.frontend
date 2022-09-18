import { Search } from '@mui/icons-material';
import { Autocomplete, Button, Grid, InputAdornment, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react'
import useProfile from '../../utils/useProfile';

const SearchCustomWorkout = ({setStartWorkout, workoutType}) => {
    const { state, dispatch } = useProfile();
    const [searchValue, setSearchValue] = useState([
      {
        columnField: "name",
        operatorValue: "contains",
        value: "",
      },
    ]);
    const [selectionModel, setSelectionModel] = useState([]);
  
    // need to create autocomplete search for assigned workouts. only should be able to select one at a time! 
    // once selected need to display a start button and change page to allow the workout reps and sets info to be entered and saved to api . 

  const columns = useMemo(
    () => [
      { field: "_id", hide: true },
      // { field: "picture", headerName: "Picture", width: 70 },
      {
        field: "name",
        headerName: "Workout",
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
    [state.customWorkouts]
  );

  console.log(workoutType)
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
        options={state.customWorkouts.map((option) => option.name)}
        renderInput={(params) => <TextField {...params}  InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <Search/>
                                  </InputAdornment>
                                ),
                              }}label="Search" />}
      />
      <DataGrid
        filterModel={{
          items: searchValue,
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
        hideFooter
        showCellRightBorder={false}
        disableSelectionOnClick={true}
        // selectionModel={selectionModel}
        // onSelectionModelChange={setSelectionModel}
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
      
    </Grid>
    <Grid item sx={{justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>
    {selectionModel.length !==0 && <Button variant='contained' 
    onClick={() => {
      setStartWorkout(state.customWorkouts.filter((w) => w._id === selectionModel[0]))
    }}
    >Start</Button>}

    </Grid>
  </>
  )
}

export default SearchCustomWorkout