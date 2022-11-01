import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Grid, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect } from "react";
import { useProfile, useWorkouts } from "../../Store/Store";

///// need to update selection to reflect current assignment plus new assignment
//

export default function AssignCustomWorkouts({
  setOpenDialog,
  openDialog,
  row,
}) {
  const [loading, setLoading] = useState(false);
  const customWorkouts = useWorkouts((state) => state.customWorkouts);
  const updateCustomWorkoutState = useWorkouts((state) => state.updateCustomWorkout);
  const clients = useProfile((state) => state.clients);
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
    [customWorkouts]
  );

  //api call to update workout
  const updateCustomWorkout = async (data) => {
    console.log(data);
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await axiosPrivate.put(`/custom-workout`, data, {
        signal: controller.signal,
      });
      updateCustomWorkoutState(response.data);
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

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAssignWorkout = () => {
    row.assignedIds = selectionModel;

    updateCustomWorkout(row);
    handleClose();
  };

  useEffect(() => {
    if (row) {
      let tmp = [];
      clients.forEach((client) => {
        if (row.assignedIds.includes(client._id)) {
          //then add to selectionModel
          tmp.push(client._id);
        }
      });
      setSelectionModel(tmp);
    }
  }, [row, clients]);

  console.log(selectionModel);

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle> Assigned Clients</DialogTitle>
        <DialogContent>
          <h2>Workout: {row?.name}</h2>
          <Grid item sx={{ mb: 10, mt: 2 }}>
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
              options={clients.map((option) => option.name)}
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
              //disable multiple box selection
              onSelectionModelChange={(selection) => {
                //if client id is assigned to workout add to selectionModel
                //make sure no duplicates
                const selectionSet = new Set(selectionModel);
                const result = selection.filter((s) => !selectionSet.has(s));

                console.log(selection);

                //if result is not empty means its a new selection
                if (result.length > 0) {
                  // if its a new selection add to selectionModel

                  setSelectionModel((prev) => [...prev, result[0]]);
                } else {
                  //means this selection is already selected
                  setSelectionModel((prev) =>
                    prev.filter((s) => {
                      if (s.includes(selection)) {
                        return false;
                      }
                    })
                  );
                }
              }}
              selectionModel={selectionModel}
              rows={clients}
              checkboxSelection={true}
              disableColumnMenu={true}
              // hideFooter
              showCellRightBorder={false}
              disableSelectionOnClick={true}
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
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAssignWorkout}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
