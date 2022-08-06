
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../utils/axios';
import useAuth from '../utils/useAuth';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { useForm, Controller } from "react-hook-form";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { DevTool } from "@hookform/devtools";
// import { ErrorMessage } from '@hookform/error-message';






const Login = ({ setUser }) => {

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const LOGIN_URL = '/login';
  const { handleSubmit, reset, control, getValues, errors } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
  // const watchFields = watch();


  const Copyright = (props) => {


    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link to="/">
          GetFit App
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );

  }




  const onSubmit = async (data) => {

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify(data),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      console.log(JSON.stringify(response.data));

      const { email, firstName, lastName, accessToken, clientId, roles, trainerId, phone, age, goal, startDate, avatar } = response.data;


      setAuth({ email, firstName, lastName, accessToken, clientId, roles, trainerId, phone, age, goal, startDate, avatar });
      setUser(auth);
      reset();
      
      navigate('/dashboard', { replace: true });

    } catch (err) {
      if (!err?.response) {
        console.log('No Server Response');
      } else if (err.response?.status === 400) {
        console.log('Missing Email or Password');
      } else if (err.response?.status === 401) {
        console.log('Unauthorized');
      } else {
        console.log('Login Failed');
      }
    }
  }











  return (


    <Container component="main" maxWidth="xs">


      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          autoFocus: true,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: red[500] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Member Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate autoComplete='off'>

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
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email"
                error={error}
                id="email"
                type="email"
                autoFocus
              />
            )}
            name="email"
            control={control}
            rules={{ required: "Please enter a valid email address", pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }}

          />

          <Controller
            render={({
              field: { onChange, onBlur, value, name, ref, setError },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <TextField
                value={value}
                onChange={onChange} // send value to hook form
                onBlur={onBlur} // notify when input is touched
                inputRef={ref} // wire up the input ref
                margin="normal"

                fullWidth
                name={name}
                label="Password"
                type="password"
                id="password"
                error={error}


                autoComplete="current-password"
              />
            )}

            name="password"

            control={control}
            rules={{
              required: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
              min: 8,


            }}


          />



          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
         
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='/login' >
                Forgot password
              </Link>
            </Grid>
            <Grid item>
              <Link to='/sign-up'>
                Don't have an account?
              </Link>
            </Grid>
          </Grid>

        </form>
        <DevTool control={control} />


      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />









    </Container>

  )
}


export default Login;
