import {
  Button,
  TextField,
  
  Typography,
  Grid,
  Paper,
  Avatar,
  Fab,
  CircularProgress,
  Backdrop,
  Modal,
  Fade,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../../assets/BASE_URL";

import DeleteIcon from "@mui/icons-material/Delete";

import {
  Add,
  Close,
 
  AdminPanelSettings,

  AdminPanelSettingsOutlined,
  FitnessCenter,
  People,
  PeopleOutlined,
  FitnessCenterOutlined,
} from "@mui/icons-material";

import { Box } from "@mui/system";
import UsersActions from "./UsersActions";
import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
import Confirm from "../Modals/Confirm";
const Users = () => {
  const { state } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleModal = () => setOpen((prev) => !prev);
  const handleConfirm = () => {
    
    onDelete(userId)
    setConfirmOpen(false);


  }
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    reset,
    control,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

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
                onClick={() => {
                  setConfirmOpen(true);
                  setUserId(params.row._id);
                }}
              >
                <DeleteIcon />
                {loading && <CircularProgress />}
              </Fab>
            </>
          );
        },
      },
      {
        field: "avatar_url",
        headerName: "Avatar",
        width: 60,
        renderCell: (params) => {
          return (
            <Avatar src={`${BASE_URL}/avatar/${params.row.avatar}`}>
              {params.row.firstname[0].toUpperCase()}{" "}
            </Avatar>
          );
        },

        sortable: false,
        filterable: false,
      },

      {
        field: "firstname",
        headerName: "First Name",
        width: 120,
        editable: true,
      },
      {
        field: "lastname",
        headerName: "Last Name",
        width: 130,
        editable: true,
      },
      { field: "email", headerName: "Email", width: 170, editable: true },
      {
        field: "phone",
        headerName: "Phone Number",
        width: 130,
        editable: true,
      },
      {
        field: "roles",
        headerName: "Roles",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <>
              <Tooltip title="Admin">
                <Checkbox
                  {...register("roleAdmin")}
                  name="roleAdmin"
                  checkedIcon={<AdminPanelSettings />}
                  icon={<AdminPanelSettingsOutlined />}
                  onChange={(e) => {
                    e.target.checked && params.row.roles.Admin == null
                      ? (params.row.roles.Admin = 10)
                      : (params.row.roles.Admin = null);
                    setRowId(params.row._id);
                  }}
                  defaultChecked={params.row.roles.Admin === 10 ? true : false}
                />
              </Tooltip>

              <Tooltip title="Trainer">
                <Checkbox
                  {...register("roleTrainer")}
                  name="roleTrainer"
                  checkedIcon={<FitnessCenter />}
                  icon={<FitnessCenterOutlined />}
                  onChange={(e) => {
                    e.target.checked && params.row.roles.Trainer == null
                      ? (params.row.roles.Trainer = 5)
                      : (params.row.roles.Trainer = null);
                    setRowId(params.row._id);
                  }}
                  defaultChecked={params.row.roles.Trainer === 5 ? true : false}
                />
              </Tooltip>
              <Tooltip title="Client">
                <Checkbox
                  {...register("roleClient")}
                  name="roleClient"
                  checkedIcon={<People />}
                  icon={<PeopleOutlined />}
                  onChange={(e) => {
                    e.target.checked && params.row.roles.Client == null
                      ? (params.row.roles.Client = 2)
                      : (params.row.roles.Client = null);
                    setRowId(params.row._id);
                  }}
                  defaultChecked={params.row.roles.Client === 2 ? true : false}
                />
              </Tooltip>
            </>
          );
        },

        editable: true,
        width: 150,
      },
      {
        field: "verified",
        headerName: "Email Verified",
        width: 70,
        editable: true,
      },

      {
        field: "modify",
        headerName: "Modify",
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <UsersActions
              rowId={rowId}
              params={params}
              setRowId={setRowId}
              setUsers={setUsers}
              users={users}
            />
          );
        },
      },
    ],
    [rowId, users]
  );

  useEffect(() => {
    // check if the user is admin
    if (!state.profile.roles.includes(10)) {
      //not admin send to 404

      navigate("/404", { replace: true });
    }

    document.title = "Manage Users";

    getUsers();
  }, []);
  const getUsers = async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/users", {
        signal: controller.signal,
      });
      // console.log(response.data);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
    }
    return () => {
      controller.abort();
    };
  };

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/register", data, {
        signal: controller.signal,
      });
      console.log(response.data);
      setUsers([...users, response.data]);
      reset();
      handleModal();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const onDelete = async (id) => {
    // if (!values.deleteExercise.checked  )  return false;
    let isMounted = true;
    setLoading(true);

    //ask for confirmation

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/users/${id}`, {
        signal: controller.signal,
      });
      console.log(response.data);
      reset();
      setLoading(false);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  // Update to DataGrid component

  return (
    <Grid container mt={5} justifyContent="center" alignItems="center" sx={{}}>
      <Confirm
        title={"Confirm User Delete?"}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        handleConfirm={handleConfirm}
      />
      <Paper
        elevation={4}
        sx={{
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 10,
          minHeight: "100vh",
          minWidth: "100%",
        }}
      >
        <Grid item xs={12} md={12} lg={12} sx={{ padding: 2 }}>
          <h2 variant="h4" textAlign="center" className="page-title">
            User Management
          </h2>
        </Grid>
        <Grid item xs={12}>
          {error && <p>{error}</p>}
          {loading && <CircularProgress />}

          {users && (
            <DataGrid
              disableSelectionOnClick={true}
              rows={users}
              checkboxSelection={false}
              columns={columns}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onCellEditCommit={(params) => setRowId(params.id)}
              getRowId={(row) => row._id}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              autoHeight
              sx={{ mt: 2, mb: 2 }}
            />
          )}
        </Grid>

        <Grid
          item
          sx={{ display: "flex", justifyContent: "flex-end", margin: 2 }}
        >
          <Fab onClick={handleModal}>
            <Add />
          </Fab>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
          <Button variant="contained" onClick={getUsers}>
            Refresh Users
          </Button>
        </Grid>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={styles.modal}>
              <form sx={{ mt: 1 }} autoComplete="off">
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                      Add User
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("firstName")}
                      name="firstName"
                      type="text"
                      label="First Name"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register("lastName")}
                      name="lastName"
                      type="text"
                      label="Last Name"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register("email")}
                      name="email"
                      type="email"
                      label="Email"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("phoneNum")}
                      name="phoneNum"
                      type="phone"
                      label="Phone"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register("password")}
                      name="password"
                      type="password"
                      label="Password"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("password2")}
                      name="password2"
                      type="password"
                      label="Confirm Password"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("trainerId")}
                      name="trainerId"
                      type="text"
                      label="trainer ID"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} mb={3}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleSubmit(onSubmit)();
                        handleModal();
                      }}
                      fullWidth
                    >
                      ADD User
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      onClick={handleModal}
                      color="error"
                      variant="contained"
                      size="large"
                      sx={{ mb: 2 }}
                      endIcon={<Close />}
                      fullWidth
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </Grid>
  );
};

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    mb: 2,
  },
  title: {
    padding: "10px",
    border: "5px solid black",
    borderRadius: "20px",
    backgroundColor: "#689ee1",

    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
};

export default Users;
