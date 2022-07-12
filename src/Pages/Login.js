import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validateLoginForm } from '../utils/validateLoginForm';
import {useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';


const Login = () => {

    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const [cookie, setCookie] = useState(false);






    if (Cookies.get('session_token') == undefined) {




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
                            onSubmit={(values, { resetForm }) => {

                                fetch('http://localhost:8000/logins', {
                                    method: "POST",
                                    body: JSON.stringify(values),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                    }, credentials: 'include',
                                })
                                    .then(res => {
                                        if (res.ok) {

                                            return res.json();
                                        }
                                    })

                                    .catch(error => {
                                        return error;
                                    })
                                    resetForm();
                                    setCookie(true);
                                    navigate('/login');
                                    
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
    } else {
        return (
            <>


                <Navigate to="/clients" replace={true} />
            </>
        )
    }
}
export default Login;
