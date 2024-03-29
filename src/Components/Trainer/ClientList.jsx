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
import { Clear, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { BASE_URL } from "../../assets/BASE_URL";
const ClientList = ({ setSelectedClient, setShow, handleSelectClient }) => {
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const setClients = useWorkouts((state) => state.setClients);
  const profile = useProfile((state) => state.profile);
  const isTrainer = useProfile((state) => state.isTrainer);
  const isAdmin = useProfile((state) => state.isAdmin);

  const {
    data: clients,
    error: errorClient,
    isLoading,
  } = useSWR(
    isAdmin || isTrainer
      ? `/clients/all/${profile.clientId}`
      : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (data) => setClients(data.data),
    }
  );

  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState([
    {
      columnField: "firstname",
      operatorValue: "contains",
      value: " ",
    },
  ]);

  const initialShowState = {
    measurements: false,
    workouts: false,
    account: false,
    goals: false,
  };

  const handleOptionChange = (e, params) => {
    setShow(initialShowState); //reset show state
    setSelectedClient(params.row); // set selected client
    setManageWorkout({}); // reset workout

    switch (e.target.value) {
      case "measurements":
        //show measurements hide everything else
        handleSelectClient("measurements");

        break;
      case "workouts":
        //show workouts hide everything else
        handleSelectClient("workouts");

        break;
      case "account":
        //show account hide everything else
        setShow((prev) => ({ ...prev, account: true }));
        break;
      case "goals":
        //show goals hide everything else
        handleSelectClient("goals");

        break;
      default:
        break;
    }
  };

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
      headerName: "Credit",
      width: 80,

      renderCell: (params) => <div>${params.row?.accountDetails?.credit}</div>,
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      width: 150,
      flex: 0.2,
      renderCell: (params) => (
        <div
          className="flex flex-column"
          style={{
            flexWrap: "wrap",
          }}
        >
          {params.row.lastLogin}
        </div>
      ),
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
          defaultValue={"options"}
          onChange={(e) => handleOptionChange(e, params)}
        >
          <MenuItem value="options">Options ...</MenuItem>
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
            freeSolo={true}
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
            disableColumnSelector
            rows={clients}
            checkboxSelection={false}
            columns={columns}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            // onCellClick={(params) => setSelectedClient(params.row)}
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
