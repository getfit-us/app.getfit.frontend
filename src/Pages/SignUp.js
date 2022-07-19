
import {useNavigate} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


  const theme = createTheme();



function SignUp() {
    
const navigate = useNavigate();

const onSubmit= async (values) => {
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
const { handleSubmit, reset, control, getValues, errors } = useForm({mode: 'onChange', reValidateMode: 'onChange'});

  

    return (


<ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor:  red[500] }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
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
              rules={{ required: "Please enter a First Name",  }}

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
              rules={{ required: "Please enter a Last Name",  }}

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
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>


                 
                           
       

        );
    }

    export default SignUp;