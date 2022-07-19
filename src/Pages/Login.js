
import {useForm} from 'react-hook-form';
import { useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom'
import axios from '../utils/axios';
import useAuth from '../utils/useAuth';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DevTool } from "@hookform/devtools";



const Login = () => {
    
    const { setAuth, auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    
    const LOGIN_URL = '/login';
    const { register, formState: { errors }, handleSubmit, getValues, watch, reset, control } = useForm( {mode: 'onSubmit',
reValidateMode: 'onChange'});

const values = getValues();
const WatchExerciseType = watch(['email', 'password' ]);


    const Copyright = (props) => {

       
            return (
              <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://mui.com/">
                  Get Fitness App
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>
            );
          
    }
    

    const theme = createTheme();

    const onSubmit = async (values) => {
       
            console.log(values);
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(values),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            // console.log(JSON.stringify(response.data));

            const accessToken = response.data.accessToken;
            const email = values.email
            const password = values.password


            setEmail(values.email);
            setPassword(values.password);



            setAuth({ email, password, accessToken });
           
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form  onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              useRef={register('email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              useRef={register('password')}
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
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          
        <DevTool control={control} />
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />



                        




                
                        </Container>
                        </ThemeProvider>
    )
}


export default Login;
