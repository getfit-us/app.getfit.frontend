import { Clear, Search } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";

const convertDate = (params) => {
  return params.row?.dateCompleted
    ? new Date(params.row.dateCompleted)
    : new Date(params.row.Created);
};

const DataGridViewWorkouts = ({
  workoutType = [],
  selectionModel,
  setSelectionModel,
  tabValue,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);
  const [rowParams, setRowParams] = useState(null);

  const [searchValue, setSearchValue] = useState([
    {
      columnField: "name",
      operatorValue: "contains",
      value: "",
    },
  ]);

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
                <span>
                  {params.row.dateCompleted &&
                    new Date(params.row.dateCompleted).toDateString()}
                </span>
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
                <span>
                  {params.row.Created &&
                    new Date(params.row.Created).toDateString()}
                </span>
              );
            },
          },
        ];

  return (
    <>
      <Autocomplete
        id="workout-list"
        freeSolo
        open={false}
        autoComplete
        value={searchValue[0]?.value}
        size="small"
        clearIcon={<Clear />}
        onInputChange={(e, value) => {
          setSearchValue([
            {
              columnField: "name",
              operatorValue: "contains",
              value: value,
            },
          ]);
        }}
        options={workoutType.length > 0 ? workoutType?.map((option) => option.name) : []}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear"
                      onClick={() => {
                        setSearchValue([
                          {
                            columnField: "name",
                            operatorValue: "contains",
                            value: "",
                          },
                        ]);
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
            label="Search Workouts by Name"
          />
        )}
        sx={{ mt: "1rem" }}
      />
      <DataGrid
       filterModel={{
        items: searchValue,
      }}
        initialState={{
          sorting: {
            sortModel: [
              tabValue === 0
                ? { field: "dateCompleted", sort: "desc" }
                : { field: "Created", sort: "desc" },
            ],
          },
        }}
        rows={workoutType ? workoutType : []}
        columns={columns}
        onSelectionModelChange={(selection) => {
          if (selection.length > 1) {
            const selectionSet = new Set(selectionModel);
            const result = selection.filter((s) => !selectionSet.has(s));
            setTimeout(() => {
              const buttons = document.getElementById("button-container");
              buttons.scrollIntoView({ behavior: "smooth" });
            }, 100);
            setSelectionModel(result);
          } else {
            setSelectionModel(selection);
            setTimeout(() => {
              const buttons = document.getElementById("button-container");
              buttons.scrollIntoView({ behavior: "smooth" });
            }, 100);
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
      />
    </>
  );
};

export default DataGridViewWorkouts;
