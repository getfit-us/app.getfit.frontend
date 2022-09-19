import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useProfile from "../../hooks/useProfile";
import { IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";

const SuperSetModal = ({
  modalOpenSuperSet,
  setModalOpenSuperSet,
  startWorkout,
  setSuperSet,
  superSet,
  setStartWorkout,
  numOfSuperSets,
  setNumOfSuperSets,
}) => {
  const { state, dispatch } = useProfile();
  const [selectionModel, setSelectionModel] = useState([]);

  const handleOpen = () => setModalOpenSuperSet(true);
  const handleClose = () => {
    setModalOpenSuperSet(false);
  };

  const handleSuperSet = () => {
    // add selected to superset state

    //update state for the number of supersets
    setNumOfSuperSets(prev => prev + 1);

    setSuperSet((prev) => {
        const updated = { ...prev}
        updated[`SuperSets${numOfSuperSets}`] = []
      startWorkout[0].exercises.map((exercise) => {
        selectionModel.map((name) => {
          if (Object.keys(exercise).toString() === name.toString()) {
            updated[`SuperSets${numOfSuperSets}`].push(exercise);
          }
        });
      });
      return updated;
    });


    // let filtered = startWorkout[0].exercises.filter((exercise) => selectionModel.indexOf(exercise) === -1);
   

    // setStartWorkout((prev) => {
    //   const updated = prev;
    //   selectionModel.map((item) => {
    //   const exercises = updated[0].exercises.filter((exercise) => {
    //     console.log(Object.keys(exercise).toString(), item.toString())

    //   })
    //   updated[0].exercises = exercises;

    //     return updated;
    //   });
  

    //remove selected from startWorkout state

    handleClose();
  };

  //create rows for the data grid
  const rows = startWorkout[0].exercises.map((exercise, index) => {
    return {
      id: Object.keys(exercise),
      name: Object.keys(exercise),
    };
  });

//   superSet.map((exercise) => {
//     rows.push(exercise);
//   });

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


  return (
    <div>
      <Modal
        open={modalOpenSuperSet}
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
          <div style={style.form}>
            <DataGrid
              //   filterModel={{
              //     items: searchValue,
              //   }}
              onSelectionModelChange={(ids) => {
                // const selectedRowData = rows.filter((row) => row.id  === )

                setSelectionModel(ids);

                // setCheckedExerciseSuperSet([...checkedExerciseSuperSet, params.row]);
              }}
              rows={rows}
              checkboxSelection={true}
              disableColumnMenu={true}
              hideFooter
              showCellRightBorder={false}
              disableSelectionOnClick
              selectionModel={selectionModel}
              columns={columns}
              //   rowsPerPageOptions={[5, 10, 20, 50, 100]}
              pageSize={5}
              //   onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}

              getRowId={(row) => row.id}
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
          </div>
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
  );
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
