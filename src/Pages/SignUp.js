
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Modal,  ToggleButton, ToggleButtonGroup, Backdrop, Fade, Card } from '@mui/material';
import { useState } from 'react';




const theme = createTheme();



function SignUp() {

  const navigate = useNavigate();
  const [alignment, setAlignment] = useState('user');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const onSubmit = async (values) => {
   
    values.roles = {};
    values.roles.Trainer = 5;
    
    fetch('http://localhost:8000/register', {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {

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
    if (event.target.value === 'client') {
      setAnchorEl(event.currentTarget);
      setOpen(true);

      
    }
    setAlignment('user');
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };


  return (



    <Container component="main" maxWidth="xs"  >
      <CssBaseline />
      <Card elevation={3} sx={{p:3, mt:4, mb:3, borderRadius: 2}}>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 5,
          minHeight: '',
          
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
            <Grid item xs={12} sx={{justifyContent: 'center', alignItems: 'center', textAlign:'center'}}>
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                
              >
                <ToggleButton value="user" sx={{justifyContent: 'center', alignItems: 'center'}}>I'm a Coach</ToggleButton>
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
          <Box sx={style.modal}>
            <Typography id="transition-modal-title" variant="h6" component="h2" textAlign='center'>
              Clients
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Please wait for your Trainer to send you a link to sign-up.
            </Typography>
          </Box>
        </Fade>
      </Modal>
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
      </Card>
   
    </Container>







  );
}
const style = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    
  }
 
};



export default SignUp;