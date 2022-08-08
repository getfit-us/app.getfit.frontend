

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../utils/useAuth';
import useAxiosPrivate from '../utils/useAxiosPrivate';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { useForm, Controller } from "react-hook-form";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ErrorMessage } from '@hookform/error-message';





const Password = () => {
    const axiosPrivate = useAxiosPrivate();
    const [update, setUpdate] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const LOGIN_URL = '/updatepassword';
    const { handleSubmit, reset, control, getValues, errors, watch, setError } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
    // const watchFields = watch();
    const watchpass = watch(['password', 'password2']);
    const values = getValues();

  




    const onSubmit = async (data) => {
        let isMounted = true;

        const controller = new AbortController();
        data.id = auth.clientId;
        data.email = auth.email;
        data.accessToken = auth.accessToken;

        console.log(`outgoing data ${JSON.stringify(data)}`);
        try {
            const response = await axiosPrivate.put(LOGIN_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(JSON.stringify(response.data));

            setUpdate(true);
            setTimeout(() => {
                reset();

                navigate('/dashboard', { replace: true });
            }, "1000")


        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
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
                    minHeight: '100vh'
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: red[500] }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Change Password
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
                                name="password"
                                label="New password"
                                error={error}
                                id="password"
                                type="password"
                                autoFocus
                            />
                        )}
                        name="password"
                        control={control}
                        rules={{
                            required: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                            min: 8,
                        }}
                       

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
                                required
                                fullWidth
                                name={name}
                                label="Confirm new password"
                                type="password"
                                id="password2"
                                error={errors}



                            />
                        )}

                        name="password2"

                        control={control}
                        rules={{
                            required: "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                            min: 8,  deps: ['password']
                            


                        }}
                       


                    />


                    {/* <Grid item>
                      {errors.password2 && <Typography variant='p'>{errors.password2.message}</Typography>}
                    </Grid> */}

                    {update ? <Button
                        type="submit"
                        color="success"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Success
                    </Button> : <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update Password
                    </Button>}


                    <Grid container>
                        <Grid item xs>
                            <Link to='/login' >
                                Forgot password
                            </Link>
                        </Grid>

                    </Grid>

                </form>



            </Box>
            








        </Container>

    )
}





export default Password