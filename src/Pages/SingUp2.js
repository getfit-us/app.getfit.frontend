
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Popover,  ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to="/">
        wwww.Getfitness.org
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();



function SignUp2() {

  const navigate = useNavigate();
  const [alignment, setAlignment] = useState('client');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {trainerId} = useParams();


  const onSubmit = async (values) => {
    values.trainerId = trainerId;
    const date = new Date().toLocaleDateString('en-US');
    values.date = date;
    console.log(values);

    fetch('http://localhost:8000/register', {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
        console.log(res)
      if (res.ok) {
        console.log('Success');
        reset();

        navigate('/login');

      }

    }).catch(error => {
      return error;
    })
  }
  const { handleSubmit, reset, control, getValues, errors } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const handleChange = (event, newAlignment) => {
    if (event.target.value === 'user') {
      setAnchorEl(event.currentTarget);
      navigate('/sign-up')

      
    }
    setAlignment('client');
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };


  return (



    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <DevTool control={control} />
        <Avatar sx={{ m: 1, bgcolor: red[500] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up for Getfit
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>


              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={error}
                  />
                )}
                name="firstName"
                control={control}
                rules={{ required: "Please enter a First Name", }}

              />

            </Grid>
            <Grid item xs={12} sm={6}>


              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    error={error}

                  />
                )}
                name="lastName"
                control={control}
                rules={{ required: "Please enter a Last Name", }}

              />

            </Grid>
            <Grid item xs={12}>

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={error}

                  />
                )}
                name="email"
                control={control}
                rules={{ required: "Please enter a valid email address", pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }}

              />


            </Grid>

            <Grid item xs={12}>

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    required
                    fullWidth
                    id="phoneNum"
                    label="Phone Number"
                    name="phoneNum"
                    autoComplete="phone"
                    error={error}

                  />
                )}
                name="phoneNum"
                control={control}
                rules={{ required: "Please enter a valid phone number.", minLength: 7 }}

              />


            </Grid>
            <Grid item xs={12}>

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={error}

                  />
                )}
                name="password"
                control={control}
                rules={{ required: "Please enter a password", minLength: 8, max: 25 }}

              />


            </Grid>
            <Grid item xs={12}>

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    required
                    fullWidth
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    autoComplete="new-password"
                    error={error}

                  />
                )}
                name="password2"
                control={control}
                rules={{ required: "Please enter a password", minLength: 8, max: 25 }}

              />



            </Grid>
            <Grid item xs={12}>
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="user">I'm a Coach</ToggleButton>
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
              sx={{border: 1, borderSpacing: 1}}>
                <Typography variant="h5" sx={{m:3 , }}>                Please wait for your trainer to send a email with your link to sign-up.
</Typography>
              </Popover>
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link to='/login'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>







  );
}

export default SignUp2;