import { useNavigate } from "react-router-dom";
import axios from "../hooks/axios";

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
import { Alert, CircularProgress, Paper } from "@mui/material";
import { SendSharp } from "@mui/icons-material";
import { useState } from "react";
import { useProfile } from "../Store/Store";
import "./Login.css";

//need to refactor this

const Login = () => {
  const setProfile = useProfile((state) => state.setProfile);
  const setIsClient = useProfile((state) => state.setIsClient);
  const setIsAdmin = useProfile((state) => state.setIsAdmin);
  const setIsTrainer = useProfile((state) => state.setIsTrainer);
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
  const [loginError, setLoginError] = useState({
    message: "",
    show: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  // const watchFields = watch();

  //if trusted device set persist
  const handlePersist = () => {
    setPersist(!persist);
  };
  //use effect to check if persist changes and save to local storage

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setProfile(response.data);
      //set user type
      response.data.roles.includes(2)
        ? setIsClient(true)
        : response.data.roles.includes(5)
        ? setIsTrainer(true)
        : response.data.roles.includes(10)
        ? setIsAdmin(true)
        : null;
      reset();
      setLoading(false);
      navigate("/dashboard/overview", { replace: true });
    } catch (err) {
      //if email unverified show error message for 6seconds
      setLoading(false);

      if (err?.response?.status === 403)
        // Unauthorized email not verified
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
      className="login"
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 24,
          mb: 3,
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            autoFocus: true,
          }}
        >
          <Avatar
            color="primary"
            sx={{ m: 1, width: "50px", height: "50px" }}
            src="../public/img/GETFIT-LOGO.png"
          >
            <img alt="" />
          </Avatar>
          <Typography component="h1" variant="h4">
            Login
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
                  id="email"
                  type="email"
                  autoFocus={true}
                  error={errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  autoComplete="email"
                />
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
                  helperText={errors.password ? errors.password.message : ""}
                  style={{ mb: 1 }}
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="persist"
                      color="primary"
                      onChange={handlePersist}
                      checked={persist}
                    />
                  }
                  label="Trust this device"
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
                ) : loading ? (
                  <CircularProgress />
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
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
