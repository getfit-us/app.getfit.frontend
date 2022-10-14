import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { red } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Alert, Paper } from "@mui/material";
import useProfile from "../hooks/useProfile";

const Password = ({}) => {
  const axiosPrivate = useAxiosPrivate();
  const [update, setUpdate] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const { auth } = useAuth();
  const {state} = useProfile();
  const LOGIN_URL = "/updatepassword";
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    watch,
    register,
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const onSubmit = async (data) => {
    let isMounted = true;

    const controller = new AbortController();
    data.id = state.profile.clientId;
    data.email = state.profile.email;
    data.accessToken = state.profile.accessToken;

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
      <Grid
        container
        sx={{
          marginTop: 5,
          display: "flex",
          justifyContent: "start",
          
          p: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Avatar variant="square" sx={{ m: 1, bgcolor: red[500] }}>
            <LockOutlinedIcon />
          </Avatar>
          </Grid>
          <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
        <Typography component="h1" variant="h5" align="center">
          {invalidPass ? (
            <Alert severity="error">Incorrect Password</Alert>
          ) : (
            "Change Password"
          )}
        </Typography>
        </Grid>
        <form
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            sx={{ display: "flex", justifyContent: "start" }}
          >
            <Grid item xs={12} sx={{ display: "flex",  }}>
              <TextField
                {...register("oldpassword", { required: true })}
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
            <Grid item xs={12} sx={{ display: "flex",  }}>
              <TextField
                {...register("password", {
                  required:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    }
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
                helperText={errors.password ? errors.password.message : ""}

              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", }}>
              <TextField
                extField
                {...register("password2", {
                  required:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    }
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
                helperText={errors.password2 ? errors.password2.message : ""}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
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
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Link to="/forgot-password">Forgot password</Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
  );
};

export default Password;
