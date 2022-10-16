import { Search } from '@mui/icons-material';
import { Autocomplete, Button, CircularProgress, Grid, InputAdornment, TextField , Box, Popper, Paper, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import  {memo, useEffect,  useState, useRef } from 'react'
import useAxios from '../../hooks/useAxios';
import useProfile from '../../hooks/useProfile';
import ContinueWorkout from './ContinueWorkout';

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
    const [pageSize, setPageSize] = useState(10);
    const [modalOpenUnfinishedWorkout, setModalOpenUnFinishedWorkout] = useState(false);

  



  //use effect to check for unfinished workout
  useEffect(() => {
   // if unfinishedworkout is found open modal and ask the user if they want to continue or start a new workout
  if (localStorage.getItem("startWorkout")) {

    // open modal
    setModalOpenUnFinishedWorkout(true)
  }
  },[]);


    // need to create autocomplete search for assigned workouts. only should be able to select one at a time! 
    // once selected need to display a start button and change page to allow the workout reps and sets info to be entered and saved to api . 

  const columns =  [
      { field: "_id", hide: true },
      {
        field: "name",
        headerName: "Workout",
        editable: false,
        selectable: false,
        width: 200,
        flex: 1,
        renderCell: renderCellExpand
       
      },
    ]


 //get assignedCustomWorkouts
 const {
  loading,
  error,
  data: assignedCustomWorkouts,
} = useAxios({
  url:  `/custom-workout/client/assigned/${state.profile.clientId}`,
  method: "GET",
  type:  "SET_ASSIGNED_CUSTOM_WORKOUTS"
}
  
);


  
  

return loading ? <CircularProgress/> : (
    <>
    
    
    <Grid item sx={{ mb: 10 }}>
    <ContinueWorkout setStartWorkout={setStartWorkout} modalOpenUnfinishedWorkout={modalOpenUnfinishedWorkout} setModalOpenUnFinishedWorkout={setModalOpenUnFinishedWorkout}/>
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
        options={workoutType.map((option) => option.name)}
        renderInput={(params) => <TextField {...params}  InputProps={{
                                startAdornment: (
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
        // hideFooter
        showCellRightBorder={false}
        disableSelectionOnClick={true}
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
        }}
      />
      
    </Grid>
    <Grid item sx={{justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>
    {selectionModel.length !==0 && <Button variant='contained' 
    onClick={() => {
      setStartWorkout(workoutType.filter((w) => w._id === selectionModel[0]))
    }}
    >Start</Button>}

    </Grid>
  </>
  )
}

export default SearchCustomWorkout