import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import useProfile from "../../../hooks/useProfile";

const convertDate = (params) => {
  return params.row?.dateCompleted
    ? new Date(params.row.dateCompleted)
    : new Date(params.row.Created);
};

const DataGridViewWorkouts = ({
  loading,
  workoutType,
  selectionModel,
  setSelectionModel,
  tabValue,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [rowParams, setRowParams] = useState(null);
  const { state } = useProfile();

  const columns =
    tabValue === 0
      ? [
          { field: "_id", hide: true },

          { field: "name", headerName: "Name", flex: 1.1 },
          {
            field: "dateCompleted",
            headerName: "Date Completed",
            flex: 1,
            type: "dateTime",
            valueGetter: convertDate,
            renderCell: (params) => {
              return (
                <div>
                  {params.row.dateCompleted &&
                    new Date(params.row.dateCompleted).toDateString()}
                </div>
              );
            },
          },
        ]
      : [
          { field: "_id", hide: true },

          { field: "name", headerName: "Name", flex: 1.1 },
          {
            field: "Created",
            type: "dateTime",
            headerName: "Date Created",
            flex: 1,
            valueGetter: convertDate,
            renderCell: (params) => {
              return (
                <div>
                  {params.row.Created &&
                    new Date(params.row.Created).toDateString()}
                </div>
              );
            },
          },
        ];


  return (
    <>
      {loading  ? <CircularProgress size={80} /> : <DataGrid
        initialState={{
          sorting: {
            sortModel: [
              tabValue === 0
                ? { field: "dateCompleted", sort: "desc" }
                : { field: "Created", sort: "desc" },
            ],
          },
        }}
        rows={workoutType}
        columns={columns}
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
        checkboxSelection={true}
        rowsPerPageOptions={[5, 10, 20, 50]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onCellEditCommit={(params) => setRowId(params.id)}
        onCellClick={(params) => setRowParams(params.row)}
        getRowId={(row) => row._id}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
            {
              display: "none",
            },
          mt: 2,
          mb: 2,
          fontWeight: "bold",
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      /> }
    </>
  );
};

export default DataGridViewWorkouts;
