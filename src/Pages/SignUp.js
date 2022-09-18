import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Backdrop,
  Fade,
  Card,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useState } from "react";
import { FitnessCenterRounded } from "@mui/icons-material";
import axios from "../utils/axios";
import ReCAPTCHA from "react-google-recaptcha";

function SignUp() {
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState("trainer");
  const [success, setSuccess] = useState({
    success: false,
    captcha: false,
  });
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const onSubmit = async (values) => {
    values.roles = {};
    if (alignment === "trainer") {
      values.roles.Trainer = 5;
    } else if (alignment === "client") values.roles.Client = 2;
    try {
      const response = await axios.post(
        "/register",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      reset();
      setTimeout(() => {setSuccess(prev => ({...prev, success: true}));}, 5000);
      navigate("/login", { replace: true });
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        console.log("Missing Email or Password");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Login Failed");
      }
    }
  };

  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const handleChange = (event, newAlignment) => {
    if (event.target.value === "client") {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
    setAlignment("trainer");
  };

const handleCaptchaChange = () => {
  setSuccess(prev => ({...prev, captcha: !prev.captcha}));

}



  
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ minHeight: "100vh", mt: 8, borderRadius: 5}}
    >
      <CssBaseline />
      <Card elevation={3} sx={{ p: 3, mt: 4, mb: 3, borderRadius: 5 }}>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Avatar color="primary" sx={{ m: 1, bgcolor: "#3070af" }}>
            <FitnessCenterRounded />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up for GetFit
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("firstName", {
                    required: true,
                    message: "Please enter your first name",
                  })}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("lastName", {
                    required: true,
                    message: "Please enter your last name",
                  })}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("email", {
                    required: true,
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register("phoneNum", {
                    required: true,
                    message: "Please enter a valid phone number.",
                    minLength: 10,
                  })}
                  required
                  fullWidth
                  id="phoneNum"
                  label="Phone Number"
                  name="phoneNum"
                  autoComplete="phone"
                  error={errors.phoneNum}
                  helperText={errors.phoneNum ? errors.phoneNum.message : ""}
                />
                
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password", {
                    required: "Please enter a password",
                     pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                        message: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                      }
                  })}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password2", {
                    required: "Please enter a password",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                    }
                  })}
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="new-password"
                  error={errors.password2}
                  helperText={errors.password2 ? errors.password2.message : ""}
                  rules={{
                    required: "Please enter a password",
                    minLength: 8,
                    max: 25,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton
                    value="trainer"
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    I'm a Trainer
                  </ToggleButton>
                  <ToggleButton value="client">I'm a Client</ToggleButton>
                </ToggleButtonGroup>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={open}>
                    <Grid container spacing={1} sx={style.modal}>
                      <Typography
                        id="transition-modal-title"
                        variant="h6"
                        component="h2"
                        textAlign="center"
                      >
                        Clients
                      </Typography>
                      <Typography
                        id="transition-modal-description"
                        sx={{ mt: 2 }}
                      >
                        Please wait for your Trainer to send you a link to
                        sign-up.
                      </Typography>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {" "}
                        <Button
                          variant="contained"
                          onClick={handleClose}
                          color="warning"
                        >
                          Ok
                        </Button>
                      </Grid>
                    </Grid>
                  </Fade>
                </Modal>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{mt: 2,display: "flex", justifyContent: "center"}}> <ReCAPTCHA sitekey="6LcF2AgiAAAAAC8yHGKrvalDgLyENYk3oZX2eJ2P"
            onChange={handleCaptchaChange}/></Grid>
           
            {success.success ? (
              <>
                <Button
                  color="success"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up Successful
                </Button>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Check your email to — <strong>Confirm your account</strong>
                </Alert>{" "}
              </>
            ) : (
              <Button
                type="submit"
                disabled={success.captcha ? false : true}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            )}

            {!success.success && (
              <Grid container justifyContent="center">
                <Grid item>
                  <Link to="/login">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
const style = {
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
    display: "flex",
    justifyContent: "center",
  },
};

export default SignUp;
