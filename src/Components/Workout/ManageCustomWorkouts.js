import { Delete } from "@mui/icons-material";
import { CircularProgress, Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import useProfile from "../../hooks/useProfile"

const ManageCustomWorkouts = () => {
    const {state, dispatch} = useProfile();
    const [loading, setLoading] = useState(false);

    const columns = useMemo(
        () => [
          { field: "_id", hide: true },
          {
            field: "delete",
            headerName: "Delete",
            width: 60,
            height: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              return (
                <>
                  <Fab
                    aria-label="add"
                    color="error"
                    size="small"
                    // onClick={() => onDelete(params.row._id)}
                  >
                    <Delete />
                    {loading && <CircularProgress />}
                  </Fab>
                </>
              );
            },
          },{field: "name",headerName: "Workout Name",  width: 60,}
         ],
          [state.customWorkouts]
        );

    console.log(state.CustomWorks)
  return (
    
    <div>
       {state.customWorkouts && (
            <DataGrid
              disableSelectionOnClick={true}
              rows={state.customWorkouts}
              checkboxSelection={false}
              columns={columns}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
            //   pageSize={pageSize}
            //   onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            //   onCellEditCommit={(params) => setRowId(params.id)}
              getRowId={(row) => row._id}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              autoHeight
              sx={{ mt: 2, mb: 2 }}
            />
          )}

    </div>
  )
}

export default ManageCustomWorkouts