import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useProfile from "../../hooks/useProfile";
import { IconButton, List, ListItem, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";

const SuperSetModal = ({
  modalSuperSet,
  setModalSuperSet,
  startWorkout,
  superSet,
  setStartWorkout,
  exerciseId,
  inSuperSet,
}) => {
  const { state, dispatch } = useProfile();
  const [selectionModelExercises, setSelectionModelExercises] = useState([
    exerciseId,
  ]);

  const handleClose = () => {
    setModalSuperSet(false);
  };

  const handleSuperSet = () => {
    // add selected to superset state

    // need to add selected exercises from addexercise array to superset array
    console.log(selectionModelExercises);

    //loop through startworkout array and add selected to superset state (each superset will be a array inside the array because we are going to be able to have more then one superset if needed)
    setStartWorkout((prev) => {
      let updated = JSON.parse(JSON.stringify(prev))

      let newSuperSetArr = [];
      //loop through startworkout array and add selected to superset array with uuid for datagrid and a
      startWorkout.forEach((exercise) => {
        if (selectionModelExercises.includes(exercise._id)) {
          // if found we are going to group into new array and push to superset array
          newSuperSetArr.push(exercise);
        }
      });
      let filtered = updated.filter((exercise) => !selectionModelExercises.includes(exercise._id)); //



      filtered.push(newSuperSetArr);
      return filtered;
    });

   
  };

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
    [startWorkout]
  );

//if we are in rendersuperset






return (
  
 
    <div>
      
      <Modal
        open={modalSuperSet}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.container}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Super Set or Giant Set
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            style={style.close}
          >
            <CloseIcon />
          </IconButton>
          {inSuperSet ? (<List>
    {startWorkout.map(exercise => {
      return (
        <ListItem
          key={exercise._id}
          >{exercise.name}</ListItem>
          
      )

    })}
    </List>) : 
          <div style={style.form}>
            <DataGrid
              onSelectionModelChange={(ids) => {
                // const selectedRowData = rows.filter((row) => row.id  === )

                setSelectionModelExercises(ids);
              }}
              rows={startWorkout}
              checkboxSelection={true}
              disableColumnMenu={true}
              hideFooter
              showCellRightBorder={false}
              disableSelectionOnClick
              selectionModel={selectionModelExercises}
              columns={columns}
              //   rowsPerPageOptions={[5, 10, 20, 50, 100]}
              pageSize={5}
              //   onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}

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
          </div>}

          <Button
            variant="contained"
            size="medium"
            sx={{ align: "center", borderRadius: 20 }}
            onClick={handleSuperSet}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
)
};

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: 2,
  },
  form: {
    p: 3,
  },
  close: {
    position: "fixed",
    top: 0,
    right: 0,
  },
};

export default SuperSetModal;
