import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Grid, InputAdornment } from "@mui/material";
import useProfile from "../../hooks/useProfile";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

 ///// working on api call to update custom workout with assigned client id



export default function AssignCustomWorkouts({ setOpenDialog, openDialog , params}) {
    const { state, dispatch } = useProfile();
    const [loading, setLoading] = useState(false);


    const [searchValue, setSearchValue] = useState([
        {
          columnField: "name",
          operatorValue: "contains",
          value: "",
        },
      ]);
      const [selectionModel, setSelectionModel] = useState([]);
      const [pageSize, setPageSize] = useState(10);
      const axiosPrivate = useAxiosPrivate();


      //api call to update workout
      const updateCustomWorkout = async (data, id) => {
        const controller = new AbortController();
        setLoading(true);
        try {
          const response = await axiosPrivate.get(
            `/custom-workout`, data,
            {
              signal: controller.signal,
            }
          );
          dispatch({ type: "MODIFY_CUSTOM_WORKOUT", payload: response.data });
          setLoading(false);
          // reset();
        } catch (err) {
          console.log(err);
          if (err.response.status === 409) {
            //     setSaveError((prev) => !prev);
            //     setTimeout(() => setSaveError((prev) => !prev), 5000);
            //   }
          }
          return () => {
            controller.abort();
            setLoading(false);
          };
        }
      };


      const columns = useMemo(
        () => [
          { field: "_id", hide: true },
          // { field: "picture", headerName: "Picture", width: 70 },
          {
            field: "firstname",
            headerName: "firstname",
            editable: false,
            selectable: false,
            width: 100,
           
          },
          {
          field: "lastname",
          headerName: "lastname",
          editable: false,
          selectable: false,
          width: 100,
         
          },
        
        ],
        [state.customWorkouts]
      );
    


  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

const handleAssignWorkout = () => {
    let id = selectionModel[0]
    updateCustomWorkout();

};


console.log(selectionModel)

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle> Assigned Clients</DialogTitle>
        <DialogContent>
        <Grid item sx={{ mb: 10 ,mt: 2}}>
        <Autocomplete
        id="Client-list"
        freeSolo
        open={false}
        onInputChange={(e, value) => {
       
            setSearchValue([
              {
                columnField: "firstname",
                operatorValue: "contains",
                value: value,
              },
            ]);
          
        }}
        options={state.clients.map((option) => option.name)}
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

      
        rows={state.clients}
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
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAssignWorkout}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
