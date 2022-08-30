import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../utils/useAuth";
import useAxiosPrivate from "../utils/useAxiosPrivate";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { red } from "@mui/material/colors";
import { useForm, Controller } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ErrorMessage } from "@hookform/error-message";
import { Alert, Paper } from "@mui/material";

const Password = ({}) => {
  const axiosPrivate = useAxiosPrivate();
  const [update, setUpdate] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const LOGIN_URL = "/updatepassword";
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    watch,
    setError,
    register,
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });
  // const watchFields = watch();
  const watchpass = watch(["password", "password2"]);
  const values = getValues();

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    data.id = auth.clientId;
    data.email = auth.email;
    data.accessToken = auth.accessToken;

    console.log(`outgoing data ${JSON.stringify(data)}`);
    try {
      const response = await axiosPrivate.put(LOGIN_URL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response.data));

      setUpdate(true);
      setInvalidPass(false);
      setTimeout(() => {}, "1000");
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) setInvalidPass(true);
      setTimeout(() => setInvalidPass(false), "5000");
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
    },
  };

  return (
    <Paper elevation={4} style={styles.paper}>
      <Grid
        container
        sx={{
          marginTop: 5,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          p: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <Avatar variant="square" sx={{ m: 1, bgcolor: red[500] }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Typography component="h1" variant="h5" align="center">
          {invalidPass ? (
            <Alert severity="error">Incorrect Password</Alert>
          ) : (
            "Change Password"
          )}
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Grid item sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <TextField
                {...register("oldpassword", { required: true })}
                margin="normal"
                required
                fullWidth
                name="oldpassword"
                label="Old password"
                error={errors.oldpassword}
                id="oldpassword"
                type="password"
                control={control}
                sx={{ m: 1 }}
              />
            </Grid>
            <Grid item sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <TextField
                {...register("password", {
                  required:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                  min: 8,
                })}
                margin="normal"
                required
                fullWidth
                name="password"
                label="New password"
                error={errors.password}
                id="password"
                type="password"
                control={control}
                sx={{ m: 1 }}
              />
            </Grid>
            <Grid item sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <TextField
                extField
                {...register("password2", {
                  required:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                  min: 8,
                  deps: ["password", "oldpassword"],
                })}
                margin="normal"
                required
                name="password2"
                label="Confirm password"
                type="password"
                id="password2"
                fullWidth
                error={errors.password2}
                sx={{ m: 1 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              {update ? (
                <Button
                  type="submit"
                  color="success"
                  variant="contained"
                  sx={{ mt: 3, mb: 1 }}
                >
                  Success
                </Button>
              ) : (
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 1 }}>
                  Update Password
                </Button>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Link to="/login">Forgot password</Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Paper>
  );
};

export default Password;
