import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import {  Formik, Field, Form, ErrorMessage } from 'formik';
import { validateLoginForm } from '../utils/validateLoginForm';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../utils/axios';
import useAuth from '../utils/useAuth';



const Login = () => {
    
    const { setAuth, auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const LOGIN_URL = '/login';


    useEffect(() => {
        console.log('use effect ran');



    }, [auth]);













    return (
        <Container className="login-form">
            <Row>
                <Col>
                    <h2 className='text-center'>Login</h2>
                </Col>



            </Row>



            <Row>
                <Col>
                    <Formik
                        initialValues={{

                            email: '',
                            password: '',

                        }}
                        onSubmit={async (values) => {

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


                                // <Navigate to='/clients' />



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

                        }}


                        validate={validateLoginForm} >

                        <Form>

                            <FormGroup row>
                                <Label htmlFor='email' md='2'>
                                    Email

                                </Label>
                                <Col md='10'>
                                    <Field className="form-control" name='email' placeholder='Email'></Field>
                                    <ErrorMessage name='email'>
                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                    </ErrorMessage >
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor='password' md='2'>
                                    Password

                                </Label>
                                <Col md='10'>
                                    <Field className="form-control" name='password' placeholder='Password' type='password'></Field>
                                    <ErrorMessage name='password'>
                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                    </ErrorMessage >
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Col md={{ size: 10, offset: 2 }}>
                                    <Button type='submit' color='secondary' >

                                        Login
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>




                    </Formik>


                </Col>
            </Row>


        </Container>


    )
}


export default Login;
