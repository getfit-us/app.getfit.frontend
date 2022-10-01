import { useNavigate, useLocation } from "react-router-dom";
import axios from "../hooks/axios";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { DevTool } from "@hookform/devtools";
import { Alert, Paper } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import {
  FitnessCenterRounded,
  SendSharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
// import { ErrorMessage } from '@hookform/error-message';

//need to refactor this

const Login = () => {
  const { state, dispatch } = useProfile();
  const { setAuth, auth } = useAuth();
  const [loginError, setLoginError] = useState({
    message: "",
    show: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const LOGIN_URL = "/login";
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  // const watchFields = watch();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });


      const {
        email,
        firstName,
        lastName,
        accessToken,
        clientId,
        roles,
        trainerId,
        phone,
        age,
        goals,
        startDate,
        avatar,
      } = response.data;

      setAuth({
        email,
        firstName,
        lastName,
        accessToken,
        clientId,
        roles,
        trainerId,
        phone,
        age,
        goals,
        startDate,
        avatar,
      });
      dispatch({
        type: "SET_PROFILE",
        payload: response.data,
      });
      // setUser(auth);
      reset();

      navigate("/dashboard", { replace: true });
    } catch (err) {
      //if email unverified show error message for 6seconds
      if (err.response.status === 403) // Unauthorized email not verified
        setLoginError((prev) => ({
          ...prev,
          message: "Please verify your email address",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);

      if (err.response.status === 401)
        setLoginError((prev) => ({
          ...prev,
          message: "Unauthorized",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);

      if (err.response.status === 423)
        setLoginError((prev) => ({
          ...prev,
          message: "Account Disabled",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 3, mt: 24, mb: 3, borderRadius: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            autoFocus: true,
          }}
        >
          <Avatar color="primary" sx={{ m: 1, bgcolor: "#3070af" }}>
            <FitnessCenterRounded />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in to GetFit
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
            <Grid container spacing={1}>
              <Grid item xs={12}>
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
                  autoFocus
                />
                <ErrorMessage errors={errors} name="email" />
              </Grid>
              <Grid item xs={12}>
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
                  style={{ mb: 1 }}
                />

                <ErrorMessage errors={errors} name="password" />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Link to="/forgot-password">Forgot password</Link>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {loginError.show ? (
                  <Alert severity="error">{loginError.message}</Alert>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={<SendSharp />}
                  >
                    Login
                  </Button>
                )}
              </Grid>

              <Grid item xs={12}>
                <Link to="/sign-up">Don't have an account?</Link>
              </Grid>
            </Grid>
          </form>
          <DevTool control={control} />
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
