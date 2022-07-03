import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { validateSignupForm } from '../utils/validateSignupForm';




function SignUp() {

    


  

    return (
            <Container className="m-5">
                <Row>
                    <Col>
                        <h2 className="text-center">Sign Up</h2>
                    </Col>

                </Row>

                <Row>
                    <Col >
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                phoneNum: '',
                                password: '',

                            }}
                            onSubmit={(values, { resetForm }) => {
                                fetch('http://localhost:8000/users', {
                                    method: "POST",
                                    body: JSON.stringify(values),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(res => {
                                    
                                    if (res.ok) {
                                        console.log('Success')
                                        resetForm();
                                    }
                                    
                                }).catch(error => {
                                    return error;
                                })
                            }}
                            validate={validateSignupForm} >

                            <Form>
                                <FormGroup row>
                                    <Label htmlFor="firstName" md='2'>
                                        First Name

                                    </Label>
                                    <Col md='10'>
                                        <Field name="firstName" placeholder='First Name' className="form-control"></Field>
                                        <ErrorMessage name='firstName'>
                                            {(msg) => <p className='text-danger'>{msg}</p>}
                                        </ErrorMessage >
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="lastName" md='2'>
                                        Last Name
                                    </Label>
                                    <Col md='10'>
                                        <Field name='lastName' placeholder='Last Name' className="form-control"></Field>
                                        <ErrorMessage name='lastName'>
                                            {(msg) => <p className='text-danger'>{msg}</p>}
                                        </ErrorMessage >
                                    </Col>

                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor='phoneNum' md='2'  >

                                        Phone
                                    </Label>
                                    <Col md='10'>
                                        <Field className="form-control" name='phoneNum' placeholder='Phone Number'></Field>
                                        <ErrorMessage name='phoneNum'>
                                            {(msg) => <p className='text-danger'>{msg}</p>}
                                        </ErrorMessage >
                                    </Col>
                                </FormGroup>
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
                                        <Button type='submit' color='primary' >

                                            Sign Up
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>




                        </Formik>
                    </Col>
                </Row>
            </Container >

        )
    }

    export default SignUp;