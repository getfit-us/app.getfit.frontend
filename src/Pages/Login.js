import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validateContactForm } from '../utils/validateContactForm';



const Login = () => {


    const handleSubmit = (values, { resetForm }) => {
        console.log('form value:', values);
        console.log('in JSON format:', JSON.stringify(values));
        resetForm();
    }

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
                            password: ''

                        }}
                        onSubmit={handleSubmit}
                        validate={validateContactForm} >

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
