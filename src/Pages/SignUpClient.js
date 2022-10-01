
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm,  } from "react-hook-form";
import { Alert, AlertTitle,  Card, Popover, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import axios from '../hooks/axios';
import { FitnessCenterRounded } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';








function SignUpClient() {

  const navigate = useNavigate();
  const [alignment, setAlignment] = useState('client');
  const [goals, setGoals] = useState([]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { trainerId } = useParams();
  const [success, setSuccess] = useState({
    success: false,
    captcha: false,
  });
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const handleGoals = (event, newGoals) => {
  //  let arr = []
  //   newGoals.forEach(g => { 
  //     arr.push({goal: g, date: ''});
      
  //   });
    setGoals(newGoals);

  };
  const handleCaptchaChange = () => {
    setSuccess(prev => ({...prev, captcha: !prev.captcha}));
  
  }
  
  

  const onSubmit = async (values) => {
    values.roles = {};
    values.trainerId = trainerId;
    values.goals = [];

    if (alignment === "trainer") {
      values.roles.Trainer = 5;
    } else if (alignment === "client") values.roles.Client = 2;

    //grab goals from state and add them as objects to the values object
   goals.forEach(g => {
    values.goals.push({goal: g, date: ''});
   })
  
    try {
      const response = await axios.post(
        "/register",
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      reset();
      setSuccess(prev => ({...prev, success: true}))
      setTimeout(() =>  navigate("/login", { replace: true }), 120000);
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
 

  const handleChange = (event, newAlignment) => {
    if (event.target.value === 'trainer') {
      setAnchorEl(event.currentTarget);
      navigate('/sign-up')


    }
    setAlignment('client');
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };



  console.log(success)

  return (



    <Container component="main" maxWidth="sm" sx={{minHeight: '100vh',  mt: 8}}>
      <CssBaseline />
      <Card elevation={3} sx={{p:3, mb:3, borderRadius: 2}}>

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
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
            <Grid item xs={12} sx={{justifyContent: 'center', alignItems: 'center', textAlign:'center'}}>
              <Typography variant='h5'>Goals</Typography>
              <ToggleButtonGroup 
                value={goals}
                color='error'
                onChange={handleGoals}
                variant="outlined" aria-label="outlined primary button group">
                <ToggleButton value='Weight Loss'>Weight Loss</ToggleButton>
                <ToggleButton value='Strength'>Strength</ToggleButton>
                <ToggleButton value='Muscle'>Muscle Growth</ToggleButton>
              </ToggleButtonGroup>

            </Grid>



            <Grid item xs={12} sx={{justifyContent: 'center', alignItems: 'center', textAlign:'center'}}>
              <ToggleButtonGroup
                color="success"
                value={alignment}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="trainer">I'm a Trainer</ToggleButton>
                <ToggleButton value="client">I'm a Client</ToggleButton>

              </ToggleButtonGroup>
              <Popover
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ border: 1, borderSpacing: 1 }}>
                <Typography variant="h5" sx={{ m: 3, }}>                Please wait for your trainer to send a email with your link to sign-up.
                </Typography>
              </Popover>
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
                fullWidth
                disabled={success.captcha ? false : true}
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


export default SignUpClient;