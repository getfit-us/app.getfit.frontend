import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { validateAddWorkout } from '../utils/validateAddWorkout';
import useFetch from '../utils/useFetch';
import { useState } from 'react';


const AddWorkoutForm = () => {
    const { loading, error, data: exercises } = useFetch('http://localhost:8000/exercises');

    let Reps = Array.from(Array(41).keys());
    const [NumberFields, setNumberFields] = useState([1,2,3,4,5]);







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
                            WorkoutType: 'push',
                            Date: '',
                            Exercise: '',
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
                        {/* Pass the values object to the form so I can access the current values to change the select options of exercises */}
                        {({ values }) => (
                            <Form >
                                <FormGroup row inline>
                                    <Label htmlFor="WorkoutType" sm='1' lg='2'>
                                        Workout Type:

                                    </Label>
                                    <Col sm='2' lg='2'>
                                        <Field name="WorkoutType" placeholder='Workout Type' className="form-control" as='select' >
                                            <option value="push">Push</option>
                                            <option value="pull">Pull</option>
                                            <option value="legs">Legs</option>
                                        </Field>
                                        <ErrorMessage name='WorkoutType'>
                                            {(msg) => <p className='text-danger'>{msg}</p>}
                                        </ErrorMessage >
                                    </Col>

                                    <Label htmlFor="Date" sm='1'>
                                        Date:
                                    </Label>
                                    <Col sm='2' lg='2'>
                                        <Field type='date' name='Date' placeholder='Date' className="form-control">

                                        </Field>
                                        <ErrorMessage name='Date'>
                                            {(msg) => <p className='text-danger'>{msg}</p>}
                                        </ErrorMessage >
                                    </Col>

                                </FormGroup>

                                {/* add map to dynamically add additional fields*/}

                                {
                                    NumberFields.map((index) => {
                                        
                                        return (
                                            
                                        <FormGroup row floating className="text-center">
                                            <Label htmlFor={'Exercise' + index} md='2'  >


                                            </Label>
                                            <Col md='4' >
                                                <Field className="form-control" name={'Exercise' + index} placeholder='' as='select'>
                                                    <option value="null">Choose Exercise.....</option>
                                                    {loading && <option>Loading...</option>}
                                                    {error && <option>Error could not read exercise list</option>}

                                                    {exercises && exercises.filter(exercise => exercise.type === values.WorkoutType).map((exercise) => {





                                                        return (
                                                            <option md='5' className='m-4' key={exercise.id} value={exercise.name}>
                                                                {exercise.name}
                                                            </option>
                                                        )
                                                    })}



                                                </Field>


                                                <ErrorMessage name={'Exercise' + index}>
                                                    {(msg) => <p className='text-danger'>{msg}</p>}
                                                </ErrorMessage >
                                            </Col>

                                            <Label htmlFor={'Weight' + index} md='2'>
                                            </Label>
                                            <Col md='2' lg='2' sm='2'>

                                                <Field className="form-control" name={'Weight' + index} placeholder='Weight' type='text'>

                                                </Field>
                                            </Col>

                                            <Label htmlFor={'Reps' + index} md='2'>

                                            </Label>
                                            <Col md='3' lg='3' sm='3'>

                                                <Field className="form-control" name={'Reps' + index} placeholder='Reps' as='select'>
                                                    <option value="null">Number of Rep(s)</option>

                                                    {Reps.map((rep) => {
                                                        if (rep !== 0) {


                                                            return (

                                                                <option md='5' className='m-4' key={rep.id} value={rep}>
                                                                    {rep} { }
                                                                </option>

                                                            )
                                                        }

                                                    })}

                                                </Field>
                                            </Col>

                                            <Col md='2' lg='2' sm='2'>
                                                <Field className="form-control" name={'Sets' + index} placeholder='Sets' as='select'>
                                                    <option value="null">Set Number</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>

                                                </Field>
                                            </Col>
                                        </FormGroup>
                                        )
                                    })}

                        
                                                 
                                
                                
                                
                                
                              
                                <FormGroup row>
                                            <Col>
                                                <Button type='button' onClick={() => setNumberFields(
                                                    previousNumberFields => 
                                                    [...previousNumberFields, previousNumberFields.length ])} color='primary' >

                                                    Add Exercise
                                                </Button></Col>

                                        </FormGroup>

                                        <FormGroup row>

                                        </FormGroup>


                                        <FormGroup row>
                                            <Col md={{ size: 10 }}>
                                                <Button type='submit' color='primary' >

                                                    Log Workout
                                                </Button>
                                            </Col>
                                        </FormGroup>
                            </Form>
                        )}



                    </Formik>
                </Col>
            </Row>
        </Container >

    )

}


export default AddWorkoutForm;