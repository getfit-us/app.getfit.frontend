import { Formik, Field, Form, ErrorMessage, useFormikContext} from 'formik';
import { Container, Col, Row, FormGroup, Label, Button } from 'reactstrap';
import { validateAddWorkout } from '../utils/validateAddWorkout';
import useFetch from '../utils/useFetch';
import { useState } from 'react';


const AddWorkoutForm = () => {
    const { loading, error, data: exercises } = useFetch('http://localhost:8000/exercises');

    let Reps = Array.from(Array(41).keys());
    const [NumberFields, setNumberFields] = useState([1, 2, 3, 4, 5]);
   







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
                        enableReinitialize={true}
                        initialValues={{
                            Date: '',
                            WorkoutType:'',
                            Exercise1:  '',
                            Exercise2: '',
                            Exercise3: '',
                            Exercise4: '',
                            Exercise5: '',
                            Weight1: '',
                            Weight2: '',
                            Weight3: '',
                            Weight4: '',
                            Weight5: '',
                            Reps1: '',
                            Reps2: '',
                            Reps3: '',
                            Reps4: '',
                            Reps5: '',
                            Sets1: '',
                            Sets2: '',
                            Sets3: '',
                            Sets4: '',
                            Sets5: '',

                           
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
                        validate={ validateAddWorkout} >
                        {/* Pass the values object to the form so I can access the current values to change the select options of exercises */}
                        {({ values }) => (
                            <Form >
                                <FormGroup row inline>
                                    <Label htmlFor="WorkoutType" sm='1' lg='2'>
                                        Workout Type:

                                    </Label>
                                    <Col sm='2' lg='2'>
                                        <Field name="WorkoutType" placeholder='Workout Type' className="form-control" as='select' >
                                        <option >Choose a type</option>
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
                                    NumberFields.map((num, index) => {

                                        return (

                                            <FormGroup row floating className="text-center" key={index}>
                                                <Label htmlFor={'Exercise' + num} md='2'  >


                                                </Label>
                                                <Col md='4' >
                                                    <Field className="form-control" name={'Exercise' + num} placeholder='' as='select' >
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


                                                    <ErrorMessage name={'Exercise' + num} >
                                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                                    </ErrorMessage >
                                                </Col>

                                                <Label htmlFor={'Weight' + num} md='2' >
                                                </Label>
                                                <Col md='2' lg='2' sm='2'>

                                                    <Field className="form-control" name={'Weight' + num} placeholder='Weight' type='text' >

                                                    </Field>
                                                    <ErrorMessage name={'Weight' + num} >
                                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                                    </ErrorMessage >

                                                </Col>

                                                <Label htmlFor={'Reps' + num} md='2' >

                                                </Label>
                                                <Col md='3' lg='3' sm='3'>

                                                    <Field className="form-control" name={'Reps' + num} placeholder='Reps' as='select' >
                                                        <option value="null">Number of Rep(s)</option>

                                                        {Reps.map((rep) => {
                                                            if (rep !== 0) {


                                                                return (

                                                                    <option md='5' className='m-4' key={rep.id} value={rep}>
                                                                        {rep}
                                                                    </option>

                                                                )
                                                            }

                                                        })}

                                                    </Field>
                                                    <ErrorMessage name={'Reps' + num} >
                                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                                    </ErrorMessage >
                                                </Col>

                                                <Col md='2' lg='2' sm='2'>
                                                    <Field className="form-control" name={'Sets' + num} placeholder='Sets' as='select' >
                                                        <option value="null">Set Number</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>

                                                    </Field>
                                                    <ErrorMessage name={'Sets' + num} >
                                                        {(msg) => <p className='text-danger'>{msg}</p>}
                                                    </ErrorMessage >
                                                </Col>
                                            </FormGroup>
                                        )
                                    })}








                                <FormGroup row>
                                    <Col>
                                        <Button type='button' onClick={() => setNumberFields(
                                            previousNumberFields =>
                                                [...previousNumberFields, previousNumberFields.length + 1]
                                                
                                                
                                                
                                                )} color='primary' >

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