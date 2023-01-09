import {
  Autocomplete,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { useProfile, useWorkouts } from "../../Store/Store";
import { getClientData } from "../../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { Clear, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { BASE_URL } from "../../assets/BASE_URL";

const ClientList = ({ setSelectedClient, setShow }) => {
  const clients = useProfile((state) => state.clients);
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const [loadingClients, dataClients, errorClients] =
    useApiCallOnMount(getClientData);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState([
    {
      columnField: "firstname",
      operatorValue: "contains",
      value: "",
    },
  ]);

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 75,

      renderCell: (params) => (
        <Avatar src={`${BASE_URL}/avatar/${params.row.avatar}`}>
          {params.row.firstname[0].toUpperCase()}{" "}
        </Avatar>
      ),
    },
    {
      field: "firstname",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      width: 150,
    },

    {
      field: "accountDetails",
      headerName: "Balance",
      width: 80,

      renderCell: (params) => <div>${params.row?.accountDetails?.credit}</div>,
    },
    {
      field: "options",
      headerName: "Options",

      width: 200,

      renderCell: (params) => (
        <TextField
          select
          fullWidth
          size="small"
          defaultValue={"workouts"}
          onChange={(e) => {
            setManageWorkout({});
            setSelectedClient(params.row);
            setShow({});
            if (e.target.value === "measurements") {
              setShow({ measurements: true });
            } else if (e.target.value === "workouts") {
              setShow({ workouts: true });
            } else if (e.target.value === "account") {
              setShow({ account: true });
            } else if (e.target.value === "goals") {
              setShow({ goals: true });
            }
          }}
        >
          <MenuItem value="measurements">Measurements</MenuItem>
          <MenuItem value="workouts">Workouts</MenuItem>
          <MenuItem value="account">Account Details</MenuItem>
          <MenuItem value="goals">goals</MenuItem>
        </TextField>
      ),
    },
  ];

  return (
    <Paper
      elevation={5}
      sx={{ p: 2, borderRadius: "15px", mb: 2, width: "100%" }}
    >
      {loadingClients && clients?.length === 0 ? (
        <CircularProgress />
      ) : (
        <>
          <Autocomplete
            size="small"
            value={searchValue[0].value}
            onInputChange={(e, value) => {
              setSearchValue([
                {
                  columnField: "firstname",
                  operatorValue: "contains",
                  value: value,
                },
              ]);
            }}
            options={clients?.map(
              (client) => client.firstname + " " + client.lastname
            )}
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
                                columnField: "firstname",
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
                label="Search Clients"
                fullWidth
              />
            )}
            sx={{ marginTop: "2rem", marginBottom: "2rem" }}
          />

          <DataGrid
            initialState={{
              sortModel: [{ field: "Created", sort: "desc" }],
            }}
            filterModel={{
              items: searchValue,
            }}
            disableSelectionOnClick={true}
            rows={clients}
            checkboxSelection={false}
            columns={columns}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onCellClick={(params) => setSelectedClient(params.row)}
            getRowId={(row) => row._id}
            getRowSpacing={(params) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            autoHeight
            sx={{ mt: 2, mb: 2 }}
          />
        </>
      )}
    </Paper>
  );
};

export default ClientList;
