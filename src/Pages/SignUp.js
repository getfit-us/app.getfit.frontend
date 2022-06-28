import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Container, Col, Row, FormGroup, Label,  Button } from 'reactstrap';
import { validateContactForm } from '../utils/validateContactForm';




function SignUp() {
    const handleSubmit = (values, { resetForm }) => {
        console.log('form value:', values);
        console.log('in JSON format:', JSON.stringify(values));
        resetForm();
    }


   

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="text-center">Sign Up</h2>
                </Col>

            </Row>

            <Row>
                <Col>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',

                        }}
                        onSubmit={handleSubmit}
                        validate={validateContactForm} >

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
                    <Label htmlFor='phoneNum ' md='2'  >

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
                    <Label check md={{ size: 4, offset: 2 }}>
                        <Field name='agree' type='checkbox' className="form-check-input"></Field>
                        May we contact you?
                    </Label>
                    <Col md='4'>
                        <Field className="form-control" name='contactType' as='select' >
                            <option value="By Phone"> By Phone</option>
                            <option value="By Email"> By Email</option>

                        </Field>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label htmlFor='feedback' md='2'>
                        Your Feedback

                    </Label>
                    <Col md='10'>
                        <Field className="form-control" name='feedback' as='textarea' rows='12' />
                    </Col>
                </FormGroup>
               
               
                <FormGroup row>
                    <Col md={{ size: 10, offset: 2 }}>
                        <Button type='submit' color='primary' >

                            Send Feedback
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

export default SignUp