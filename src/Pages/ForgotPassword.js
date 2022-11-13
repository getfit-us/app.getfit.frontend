import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import { red } from "@mui/material/colors";
import { useForm, Controller } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Alert, Paper } from "@mui/material";
import { LockRounded } from "@mui/icons-material";
import axios from "../hooks/axios";
import { useParams } from "react-router-dom";

const ForgotPassword = ({}) => {
  const [apiState, setApiState] = useState({
    message: "",
    isError: false,
    changePassword: false,
    loading: false,
    success: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    watch,
    register,
  } = useForm({ mode: "onBlur", reValidateMode: "onBlur" });
  const params = useParams();

  useEffect(() => {
    //if route has params then lets show change password form if api validates successfully
    const checkParams = async (params) => {
      setApiState((prev) => ({ ...prev, loading: true }));
      const controller = new AbortController();
      try {
        const response = await axios.get(
          `/reset-password/validate/${params.id}/${params.token}`,
          {
            signal: controller.signal,
          }
        );

        setApiState((prev) => ({ ...prev, loading: false }));
        if (response.status === 200) {
          // if api validates successfully then update state to show change password form
          setApiState((prev) => ({ ...prev, changePassword: true }));
        }
      } catch (err) {
        console.log(err);
        setApiState((prev) => ({
          ...prev,
          isError: true,
          message: err.message,
        }));
      }
      return () => {
        //clean up  function
        controller.abort();
        //reset state
      };
    };

    // run api call
    if (params.token && params.id) checkParams(params);
    
    document.title = "Reset Password";

  }, [params]);


  const onSubmit = async (data) => {
    let isMounted = true;
    setApiState((prev) => ({ ...prev, loading: true }));

    const controller = new AbortController();
    // console.log(data);
    try {
      const response = await axios.post("/reset-password", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200) {
        setApiState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          message: "Email sent successfully",
        }));
      }
      reset();
    } catch (err) {
      // going to add limit to requests
      console.log(err);
      setApiState((prev) => ({
        ...prev,
        isError: true,
        message: err.message,
      }));
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const ChangePassword = async (data) => {
    // add user id to form data to prevent tampering
    setApiState((prev) => ({ ...prev, loading: true }));
    let isMounted = true;
    data.id = params.id;
    const controller = new AbortController();

    try {
      const response = await axios.post("/reset-password/verified", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.status === 200) {
        setApiState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          message: "Password successfully Updated",
        }));
      }

      reset();
    } catch (err) {
      // going to add limit to requests
      console.log(err);
      setApiState((prev) => ({
        ...prev,
        isError: true,
        message: err.message,
      }));
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const styles = {
    paper: {
      borderRadius: "10px",
      boxShadow: 3,
      padding: "2rem",
    },
  };

  return (
    <Grid
      container
      sx={{
        marginTop: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        mt: "1rem",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={4} style={styles.paper}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar variant="circle" sx={{ m: 1, bgcolor: red[500] }}>
            <LockRounded />
          </Avatar>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h4">Reset Password</Typography>
        </Grid>
        {apiState.changePassword ? (
          <form>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                spacing: 1,
                maxWidth: "300px",
              }}
            >
              <Grid item xs={12} sx={{ display: "inherit" }}>
                <TextField
                  fullWidth
                  {...register("password", {
                    required:
                      "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    min: 8,
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message:
                        "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    },
                  })}
                  type="password"
                  name="password"
                  label="Password"
                  id="password"
                  error={errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  style={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "inherit" }}>
                <TextField
                  fullWidth
                  {...register("password2", {
                    required:
                      "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    min: 8,
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message:
                        "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    },
                    deps: ["password", "password2"],
                  })}
                  type="password"
                  name="password2"
                  label="Confirm password"
                  id="password"
                  error={errors.password2}
                  helperText={errors.password2 ? errors.password2.message : ""}
                  style={{ mb: 1 }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "inherit", justifyContent: "center" }}
              >
                {" "}
                {apiState.success ? (
                  <Button variant="outlined" color="success">
                    Password successfully changed
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleSubmit(ChangePassword)}
                  >
                    Change Password
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        ) : (
          <form sx={{ mt: 1 }} noValidate autoComplete="off">
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                maxWidth: "300px",
              }}
            >
              <Grid item xs={12} sx={{ display: "inherit" }}>
                <TextField
                  {...register("email", {
                    required: "Please enter a valid email address",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  error={errors.email}
                  id="email"
                  type="email"
                  control={control}
                  sx={{ m: 1 }}
                  helperText={errors.email ? errors.email.message : ""}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "inherit", justifyContent: "center" }}
              >
                {apiState.success ? (
                  <Button variant="outlined" color="success">
                    {apiState.message}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Reset Password
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Grid>
  );
};

export default ForgotPassword;
