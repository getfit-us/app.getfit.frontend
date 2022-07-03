import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { validateAddWorkout } from '../utils/validateAddWorkout';


const AddWorkoutForm = () => {



    return (
        <Container className="m-5">
            <Row>
                <Col>
                    <h2 className="text-center">Add Workout</h2>
                </Col>

            </Row>

            <Row>
                <Col >
                    <Formik
                        initialValues={{
                            WorkoutType: '',
                            Date: '',
                            email: '',
                            phoneNum: '',
                            password: '',

                        }}
                        onSubmit={(values, { resetForm }) => {
                            fetch('http://localhost:8000/workouts', {
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
                        validate={validateAddWorkout} >

                        <Form>
                            <FormGroup row>
                                <Label htmlFor="WorkoutType" md='2'>
                                Workout Type:

                                </Label>
                                <Col md='10'>
                                    <Field name="WorkoutType" placeholder='Workout Type' className="form-control" as='select'>
                                        <option>Push</option>
                                        <option>Pull</option>
                                        <option>Legs</option>
                                    </Field>
                                    <ErrorMessage name='WorkoutType'>
                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                    </ErrorMessage >
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="Date" md='2'>
                                    Last Name
                                </Label>
                                <Col md='10'>
                                    <Field  as='select' name='Date' placeholder='Date' className="form-control"></Field>
                                    <ErrorMessage name='Date'>
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


export default  AddWorkoutForm;