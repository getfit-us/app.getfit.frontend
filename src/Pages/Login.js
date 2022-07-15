import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validateLoginForm } from '../utils/validateLoginForm';
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider';
import axios from '../utils/axios';



const Login = () => {

    const { setAuth, auth } = useContext(AuthContext);
    const [token, setToken] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const LOGIN_URL = '/login';

    console.log(`token top log login page ${token}`);



    // useEffect(() => {

    //     if (token !== undefined) {
    //         console.log(token);
    //         console.log('token set');
    //         <Navigate to='/clients' />
    //     }






    // },[token])






    if (!token) {








        return (
            <Container>
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
                            onSubmit={async ( values) => {

                                  console.log(values);

                                try {
                                    const response = await axios.post(LOGIN_URL,
                                        JSON.stringify(values),
                                        {
                                            headers: { 'Content-Type': 'application/json' },
                                            withCredentials: true
                                        }
                                    )
                                        console.log(JSON.stringify(response.data));
                                   
                                        const accessToken = response.data.accessToken;
                                        const email = values.email
                                        const password = values.password

                                      
                                        setEmail(values.email);
                                        setPassword(values.password);
                                        console.log(email, password)

                                        setAuth({ email, password, accessToken });
    
                                      
                                        
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
                               }}

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

}
export default Login;
